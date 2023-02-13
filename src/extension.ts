import {
    Disposable, Range, Position,
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
        if (counter.templates.has(templateName)){
            controller.changeTooltipTemplate(templateName);
        } else {
            window.showErrorMessage(
                `Tooltip template "${templateName}" does not exist. Please change your command according to names in the configuration.`,
                'Open settings'
            ).then((yes) => {
                if (yes){
                    commands.executeCommand('workbench.action.openSettings', 'vscode-hanzi-counter');
                }
            });
        }
	});

	context.subscriptions.push(disposable);
}

function compileTemplateFunction(parameters: string[], template: string): Function {
    let statementMatchResult = template.match(/^\s*{(.*)}\s*$/);
    let expressionMatchResult = template.match(/^\s*(.*)\s*$/);
    let functionBody: string;
    if (statementMatchResult){
        functionBody = statementMatchResult[1];
    } else if (expressionMatchResult){
        functionBody = 'return ' + expressionMatchResult[1];
    } else {
        throw new Error('template is not a valid expression or code block');
    }
    return new Function(...parameters, functionBody);
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
        let sum = 0;
        // for loop is faster than reduce
        for (let i = 0; i < this._lines.length; ++i){
            sum += this._lines[i];
        }
        this._sum = sum;
    }

    public replace(start: number, end: number, newLineCounts: number[]){
        // simple unpack with splice won't work for very long arrays
        // https://stackoverflow.com/a/41466395
        let removed = this._lines.splice(start, end - start);
        spliceArray(this._lines, start, newLineCounts);
        let removedTotalCount = 0;
        for (let i = 0; i < removed.length; ++i){
            removedTotalCount += removed[i];
        }
        this._sum -= removedTotalCount;
        let addedTotalCount = 0;
        for (let i = 0; i < newLineCounts.length; ++i){
            addedTotalCount += newLineCounts[i];
        }
        this._sum += addedTotalCount;
    }

    public getRangeSum(start: number, end: number){
        let sum = 0;
        for (let i = start; i < end; ++i){
            sum += this._lines[i];
        }
        return sum;
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
        this._enabled = configuration.get('vscode-hanzi-counter.statusBar.enabled') as boolean;
        this._statusBarTemplateName = configuration.get('vscode-hanzi-counter.template.statusBarTemplateName') as string;
        this._tooltipTemplateName = configuration.get('vscode-hanzi-counter.template.tooltipTemplateName') as string;
    }

    private _getEOLString(){
        return new Map([
            [EndOfLine.LF, '\n'], [EndOfLine.CRLF, '\r\n']
        ]).get(this._document.eol);
    }

    public recalculateCount(regexName: string){
        // calculate and store count for each line
        let regex = this._counter.regexes.get(regexName);
        if (regex === undefined){
            throw new Error(`non-existent regex "${regexName}"`);
        }
        let lineCount = [];
        for (let lineNumber = 0; lineNumber < this._document.lineCount; ++lineNumber){
            let lineText = this._document.getText(new Range(lineNumber, 0, lineNumber + 1, 0));
            let matchCount = (lineText.match(regex) ?? []).length;
            lineCount.push(matchCount);
        }
        this._cachedLineCounts.set(regexName, new CachedLineCount(lineCount));
    }

    public onContentChange(event: TextDocumentContentChangeEvent){
        let affectedLineStart = event.range.start.line;
        let affectedLineEnd = event.range.end.line;
        let eOLString = this._getEOLString();
        if (eOLString === undefined){
            throw new Error('invalid document end of line');
        }
        let newTextLineCount = countSubstring(event.text, eOLString) + 1;
        for (let [regexName, lineCounts] of this._cachedLineCounts){
            let regex = this._counter.regexes.get(regexName);
            if (regex === undefined){
                throw new Error(`non-existent regex "${regexName}"`);
            }
            let lineCount = [];
            for (let lineNumber = affectedLineStart; lineNumber < affectedLineStart + newTextLineCount; ++lineNumber){
                let lineText = this._document.getText(new Range(lineNumber, 0, lineNumber + 1, 0));
                let matchCount = (lineText.match(regex) ?? []).length;
                lineCount.push(matchCount);
            }
            lineCounts.replace(affectedLineStart, affectedLineEnd + 1, lineCount);
        }
    }

    public getCount(regexName: string, range?: Range){
        if (!this._cachedLineCounts.has(regexName)){
            this.recalculateCount(regexName);
        }
        if (!range){
            return this._cachedLineCounts.get(regexName)!.getSum();
        } else {
            let fullLineStart = range.start.character === 0 ? range.start.line : range.start.line + 1;
            let fullLineEnd = range.end.line;
            let partialBefore;
            let partialAfter;
            let fullLineCount;
            if (fullLineEnd < fullLineStart){ // only single line
                partialBefore = range;
                partialAfter = new Range(range.end, range.end);
                fullLineCount = 0;
            } else {
                partialBefore = new Range(range.start, new Position(fullLineStart, 0));
                partialAfter = new Range(new Position(fullLineEnd, 0), range.end);
                fullLineCount = this._cachedLineCounts.get(regexName)!.getRangeSum(fullLineStart, fullLineEnd);
            }

            let beforeText = this._document.getText(partialBefore);
            let beforeCount = (beforeText.match(this._counter.regexes.get(regexName)!) ?? []).length;

            let afterText = this._document.getText(partialAfter);
            let afterCount = (afterText.match(this._counter.regexes.get(regexName)!) ?? []).length;

            return beforeCount + fullLineCount + afterCount;
        }
    }

    public updateStatusBarItem(tooltipTemplateName?: string, ranges?: readonly Range[]){
        if (!this._enabled){
            this._counter.changeStatusBarItem(false);
            return;
        }
        this._counter.changeStatusBarItem(true);

        let cachedCounts = new Map();

        let getCountOfRanges = (regexName: string, ranges?: readonly Range[]) => {
            if (ranges === undefined){
                return this.getCount(regexName);
            }
            let sum = 0;
            for (let range of ranges){
                sum += this.getCount(regexName, range);
            }
            return sum;
        };

        let templateArguments = this._counter.templateParameters.map(
            s => cachedCounts.get(s) ?? cachedCounts.set(s, getCountOfRanges(s, ranges)).get(s)
        );

        let statusBarTemplate = this._counter.templates.get(this._statusBarTemplateName);
        if (statusBarTemplate !== undefined){
            this._counter.updateStatusBarItem(statusBarTemplate(...templateArguments), undefined);
        }

        tooltipTemplateName ??= this._tooltipTemplateName;
        let tooltipTemplate = this._counter.templates.get(tooltipTemplateName);
        if (tooltipTemplate !== undefined){
            this._counter.updateStatusBarItem(undefined, tooltipTemplate(...templateArguments));
        }
    }
}

class Counter {

    public readonly regexes: Map<string, RegExp>;
    public readonly templateParameters: string[];
    public readonly templates: Map<string, Function>;

    private _statusBarItem: StatusBarItem;

    constructor(configuration: WorkspaceConfiguration) {
        const regexStrings = new Map(Object.entries(
            configuration.get('vscode-hanzi-counter.counter.regexes') as object
        ));
        this.regexes = new Map();
        this.templateParameters = [];
        for (let [k, v] of regexStrings){
            this.regexes.set(k, new RegExp(v, 'gus'));
            this.templateParameters.push(k);
        }

        const templateStrings = new Map(Object.entries(
            configuration.get('vscode-hanzi-counter.counter.templates') as object
        ));
        this.templates = new Map();
        for (let [k, v] of templateStrings){
            this.templates.set(k, compileTemplateFunction(this.templateParameters, v));
        }

        this._statusBarItem = window.createStatusBarItem(
            configuration.get('vscode-hanzi-counter.statusBar.alignment') === 'left'
                ? StatusBarAlignment.Left : StatusBarAlignment.Right,
            configuration.get('vscode-hanzi-counter.statusBar.priority') ?? 105); // default left of text attributes(ln, col, spaces, encoding, etc)
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
    private _tooltipTemplateName: string | undefined;
    private _disposable: Disposable;

    constructor(counter: Counter) {
        this._counter = counter;
        this._documentCounters = new Map();

        this._tooltipTemplateName = undefined;

        // subscribe to selection change and editor activation events
        let subscriptions: Disposable[] = [];
        workspace.onDidOpenTextDocument(this._onDidOpenTextDocument, this, subscriptions);
        // remove cache when saved for possible de-sync
        workspace.onDidSaveTextDocument(this._onDidOpenTextDocument, this, subscriptions);
        workspace.onDidCloseTextDocument(this._onDidCloseTextDocument, this, subscriptions);
        workspace.onDidChangeTextDocument(this._onDidChangeTextDocument, this, subscriptions);
        window.onDidChangeActiveTextEditor(this._updateStatusBarItem, this, subscriptions);
        window.onDidChangeTextEditorSelection(this._updateStatusBarItem, this, subscriptions);

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
        this._updateStatusBarItem(null);
    }

    private _updateStatusBarItem(event: any){
        let currentDocument = window.activeTextEditor?.document;
        if (currentDocument){
            let selections = window.activeTextEditor!.selections;
            let allEmpty = true;
            for (let selection of selections){ // handle multi-selection
                if (!selection.isEmpty){
                    allEmpty = false;
                    break;
                }
            }
            if (allEmpty){ // no text is selected
                this._documentCounters.get(currentDocument)?.updateStatusBarItem(this._tooltipTemplateName);
            } else {
                this._documentCounters.get(currentDocument)?.updateStatusBarItem(this._tooltipTemplateName, selections);
            }
        } else {
            this._counter.changeStatusBarItem(false);
        }
    }

    public changeTooltipTemplate(name: string){
        this._tooltipTemplateName = name;
        this._updateStatusBarItem(null);
    }

    public dispose() {
        this._disposable.dispose();
    }
}
