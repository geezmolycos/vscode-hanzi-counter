import {
    Disposable, Range,
    window, workspace, commands,
    ExtensionContext, StatusBarItem, StatusBarAlignment,
    MarkdownString, WorkspaceConfiguration, TextEditor,
    TextDocument, TextDocumentChangeEvent, TextDocumentContentChangeEvent,
    EndOfLine
} from 'vscode';

// this method is called when your extension is activated. activation is
// controlled by the activation events defined in package.json
export function activate(context: ExtensionContext) {

    // create a new word counter
    let counter = new Counter(workspace.getConfiguration());
    let controller = new CounterController(counter);

    // add to a list of disposables which are disposed when this extension
    // is deactivated again.
    context.subscriptions.push(controller);
    context.subscriptions.push(counter);

    let disposable = commands.registerCommand('vscode-hanzi-counter.changeTooltip', (templateName) => {
        console.log(templateName);
	});

	context.subscriptions.push(disposable);
}

function compileTemplateFunction(template: string): [string[], Function] {
    let statementMatchResult = template.match(/^[ \n]*\((.*?)\) *=>[ \n]*{(.*)}[ \n]*$/);
    let expressionMatchResult = template.match(/^[ \n]*\((.*?)\) *=>[ \n]*(.*)[ \n]*$/);
    let parameters: string[];
    let functionBody: string;
    if (statementMatchResult){
        parameters = statementMatchResult[1].split(',').map(s => s.trim());
        if (parameters.length === 1 && parameters[0].length === 0){
            parameters = [];
        }
        functionBody = statementMatchResult[2];
    } else if (expressionMatchResult){
        parameters = expressionMatchResult[1].split(',').map(s => s.trim());
        if (parameters.length === 1 && parameters[0].length === 0){
            parameters = [];
        }
        functionBody = 'return ' + expressionMatchResult[2];
    } else {
        throw new Error('template is not a valid arrow function');
    }
    return [parameters, new Function(...parameters, functionBody)];
}

function countSubstring(string: string, substring: string) {
    let count = 0;
    let pos = 0;
    while (true){
        pos = string.indexOf(substring, pos);
        if (pos < 0){
            break;
        }
        ++count;
        pos += substring.length;
    }
    return count;
}

// simple unpack with splice won't work for very long arrays
// https://stackoverflow.com/a/41466395
function spliceArray(array: any[], index: number, insertedArray: any[]) {
    var postArray = array.splice(index);
    inPlacePush(array, insertedArray);
    inPlacePush(array, postArray);

    function inPlacePush(targetArray: any[], pushedArray: any[]) {
        // Not using forEach for browser compatability
        var pushedArrayLength = pushedArray.length;
        for (var index = 0; index < pushedArrayLength; index++) {
           targetArray.push(pushedArray[index]);
       }
    }
}

class CachedLineCount {
    private _lines: number[];
    private _sum: number;

    constructor(lines: number[]){
        this._lines = lines;
        this._sum = 0;
        this.recalculateSum();
    }

    public getSum(){
        return this._sum;
    }

    public recalculateSum(){
        this._sum = this._lines.reduce((a, b) => a + b, 0);
    }

    public replace(start: number, end: number, newLineCounts: number[]){
        // simple unpack with splice won't work for very long arrays
        // https://stackoverflow.com/a/41466395
        let removed = this._lines.splice(start, end - start);
        spliceArray(this._lines, start, newLineCounts);
        let removedTotalCount = removed.reduce((a, b) => a + b, 0);
        this._sum -= removedTotalCount;
        let addedTotalCount = newLineCounts.reduce((a, b) => a + b, 0);
        this._sum += addedTotalCount;
    }
}

class DocumentCounter {

    private _counter: Counter;

    private _document: TextDocument;
    private _cachedLineCounts: Map<string, CachedLineCount>;
    
    private _enabled!: boolean;
    private _statusBarTemplateName!: string;
    private _tooltipTemplateName!: string;

    constructor(counter: Counter, document: TextDocument){
        this._counter = counter;
        this._document = document;
        this._cachedLineCounts = new Map();
        this.updateConfiguration();
    }

    public updateConfiguration(){
        let configuration = workspace.getConfiguration('', this._document);
        this._enabled = configuration.get('vscode-hanzi-counter.enabled') as boolean;
        this._statusBarTemplateName = configuration.get('vscode-hanzi-counter.statusBarTemplateName') as string;
        this._tooltipTemplateName = configuration.get('vscode-hanzi-counter.tooltipTemplateName') as string;
    }

    public recalculateCount(regexName: string){
        // calculate and store count for each line
        let regex = this._counter.regexes.get(regexName);
        if (!regex){
            return;
        }
        let lineCount = [];
        for (let lineNumber = 0; lineNumber < this._document.lineCount; ++lineNumber){
            let line = this._document.lineAt(lineNumber);
            let lineText = line.text;
            let matchCount = (lineText.match(regex) ?? []).length;
            lineCount.push(matchCount);
        }
        this._cachedLineCounts.set(regexName, new CachedLineCount(lineCount));
    }

    public onContentChange(event: TextDocumentContentChangeEvent){
        let affectedLineStart = event.range.start.line;
        let affectedLineEnd = event.range.end.line;
        let eolString = new Map([
            [EndOfLine.LF, '\n'], [EndOfLine.CRLF, '\r\n']
        ]).get(this._document.eol);
        if (eolString === undefined){
            throw new Error('invalid document end of line');
        }
        let newTextLineCount = countSubstring(event.text, eolString) + 1;
        for (let [regexName, lineCounts] of this._cachedLineCounts){
            let regex = this._counter.regexes.get(regexName);
            if (regex === undefined){
                continue;
            }
            let lineCount = [];
            for (let lineNumber = affectedLineStart; lineNumber < affectedLineStart + newTextLineCount; ++lineNumber){
                let line = this._document.lineAt(lineNumber);
                let lineText = line.text;
                let matchCount = (lineText.match(regex) ?? []).length;
                lineCount.push(matchCount);
            }
            lineCounts.replace(affectedLineStart, affectedLineEnd + 1, lineCount);
        }
        if (window.activeTextEditor?.document === this._document){
            this.updateStatusBarItem();
        }
    }

    public getCount(regexName: string){
        if (!this._cachedLineCounts.has(regexName)){
            this.recalculateCount(regexName);
        }
        return this._cachedLineCounts.get(regexName)?.getSum();
    }

    public updateStatusBarItem(tooltipTemplateName?: string){
        if (!this._enabled){
            this._counter.changeStatusBarItem(false);
            return;
        } else {
            this._counter.changeStatusBarItem(true);
        }

        let evalTemplate = (regexNames: string[], templateFunction: Function) =>
            templateFunction(...regexNames.map(s => this.getCount(s)));
           
        let statusBarTemplate = this._counter.templates.get(this._statusBarTemplateName);
        if (statusBarTemplate !== undefined){
            let [statusBarRegexNames, statusBarTemplateFunction] = statusBarTemplate;
            this._counter.updateStatusBarItem(evalTemplate(statusBarRegexNames, statusBarTemplateFunction), undefined);
        }

        tooltipTemplateName ??= this._tooltipTemplateName;
        let tooltipTemplate = this._counter.templates.get(tooltipTemplateName);
        if (tooltipTemplate !== undefined){
            let [tooltipRegexNames, tooltipTemplateFunction] = tooltipTemplate;
            this._counter.updateStatusBarItem(undefined, evalTemplate(tooltipRegexNames, tooltipTemplateFunction));
        }
    }
}

class Counter {

    public readonly regexes: Map<string, RegExp>;
    public readonly templates: Map<string, [string[], Function]>;

    private _statusBarItem: StatusBarItem;

    constructor(configuration: WorkspaceConfiguration) {
        const regexStrings = new Map(Object.entries(
            configuration.get('vscode-hanzi-counter.regexes') as object
        ));
        this.regexes = new Map();
        for (let [k, v] of regexStrings){
            this.regexes.set(k, new RegExp(v, 'gu'));
        }

        const templateStrings = new Map(Object.entries(
            configuration.get('vscode-hanzi-counter.templates') as object
        ));
        this.templates = new Map();
        for (let [k, v] of templateStrings){
            this.templates.set(k, compileTemplateFunction(v));
        }

        this._statusBarItem = window.createStatusBarItem(
            configuration.get('vscode-hanzi-counter.alignment') === 'left'
                ? StatusBarAlignment.Left : StatusBarAlignment.Right,
            configuration.get('vscode-hanzi-counter.priority') ?? 105); // default left of text attributes(ln, col, spaces, encoding, etc)
        this._statusBarItem.name = 'Hanzi Counter';
    }

    public changeStatusBarItem(show: boolean){
        if (show){
            this._statusBarItem.show();
        } else {
            this._statusBarItem.hide();
        }
    }

    public updateStatusBarItem(text?: string, tooltipText?: string){
        if (text){
            this._statusBarItem.text = text;
        }
        if (tooltipText){
            let ms = new MarkdownString(tooltipText);
            ms.isTrusted = true;
            ms.supportHtml = true;
            ms.supportThemeIcons = true;
            this._statusBarItem.tooltip = ms;
        }
    }

    public dispose() {
        this._statusBarItem.dispose();
    }
}

class CounterController {

    private _counter: Counter;
    private _documentCounters: Map<TextDocument, DocumentCounter>;
    private _disposable: Disposable;

    constructor(counter: Counter) {
        this._counter = counter;
        this._documentCounters = new Map();

        // subscribe to selection change and editor activation events
        let subscriptions: Disposable[] = [];
        workspace.onDidOpenTextDocument(this._onDidOpenTextDocument, this, subscriptions);
        // remove cache when saved for possible de-sync
        workspace.onDidSaveTextDocument(this._onDidOpenTextDocument, this, subscriptions);
        workspace.onDidCloseTextDocument(this._onDidCloseTextDocument, this, subscriptions);
        workspace.onDidChangeTextDocument(this._onDidChangeTextDocument, this, subscriptions);
        window.onDidChangeActiveTextEditor(this._updateStatusBarItem, this, subscriptions);

        // some documents may be opened before we can register event handler
        for (let document of workspace.textDocuments){
            this._onDidOpenTextDocument(document);
        }
        // onDidChangeActiveTextEditor will not trigger when first open
        this._updateStatusBarItem(null);

        // create a combined disposable from both event subscriptions
        this._disposable = Disposable.from(...subscriptions);
    }

    private _onDidOpenTextDocument(document: TextDocument) {
        this._documentCounters.set(document, new DocumentCounter(this._counter, document));
    }
    
    private _onDidCloseTextDocument(document: TextDocument) {
        this._documentCounters.delete(document);
    }
    
    private _onDidChangeTextDocument(event: TextDocumentChangeEvent) {
        for (let change of event.contentChanges){
            this._documentCounters.get(event.document)?.onContentChange(change);
        }
    }

    private _updateStatusBarItem(event: any){
        let currentDocument = window.activeTextEditor?.document;
        if (currentDocument){
            this._documentCounters.get(currentDocument)?.updateStatusBarItem();
        } else {
            this._counter.changeStatusBarItem(false);
        }
    }

    public dispose() {
        this._disposable.dispose();
    }
}
