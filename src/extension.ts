
import {window, workspace, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument, MarkdownString, WorkspaceConfiguration} from 'vscode';

// this method is called when your extension is activated. activation is
// controlled by the activation events defined in package.json
export function activate(ctx: ExtensionContext) {

    // create a new word counter
    let wordCounter = new WordCounter(workspace.getConfiguration());
    let controller = new WordCounterController(wordCounter);

    // add to a list of disposables which are disposed when this extension
    // is deactivated again.
    ctx.subscriptions.push(controller);
    ctx.subscriptions.push(wordCounter);
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

class WordCounter {

    private readonly _counterRegex: Map<string, RegExp>;

    private readonly _statusBarTemplate: Function;
    private readonly _tooltipTemplate: Function;
    private readonly _clickedTooltipTemplate: Function;

    private readonly _statusBarKeys: string[];
    private readonly _tooltipKeys: string[];
    private readonly _clickedTooltipKeys: string[];

    private readonly _statusBarItem: StatusBarItem;

    constructor(configuration: WorkspaceConfiguration) {
        const counterRegexString = new Map(Object.entries(
            configuration.get('vscode-hanzi-counter.counterRegex') as object
        ));
        this._counterRegex = new Map();
        for (let k in counterRegexString){
            this._counterRegex.set(k, new RegExp(counterRegexString.get(k), 'gu'));
        }

        [this._statusBarKeys, this._statusBarTemplate] = compileTemplateFunction(configuration.get<string>('vscode-hanzi-counter.statusBarTemplate') ?? '');
        [this._tooltipKeys, this._tooltipTemplate] = compileTemplateFunction(configuration.get<string>('vscode-hanzi-counter.tooltipTemplate') ?? '');
        [this._clickedTooltipKeys, this._clickedTooltipTemplate] = compileTemplateFunction(configuration.get<string>('vscode-hanzi-counter.clickedTooltipTemplate') ?? '');

        this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 105); // left of text attributes(ln, col, spaces, encoding, etc)
    }

    public updateWordCount() {

        // Get the current text editor
        let editor = window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }

        let doc = editor.document;

        let args = this._statusBarKeys.map(key => 
            this._getWordCount(doc, this._counterRegex.get(key) ?? (()=>{throw new Error('undefined counter regex key');})())
        );

        // Update the status bar
        this._statusBarItem.text = this._statusBarTemplate(...args);
        this._statusBarItem.show();
    }

    public _getWordCount(doc: TextDocument, regex: RegExp): number {
        let docContent = doc.getText();

        let wordCount = (docContent.match(regex) || []).length;

        return wordCount;
    }

    public dispose() {
        this._statusBarItem.dispose();
    }
}

class WordCounterController {

    private _wordCounter: WordCounter;
    private _disposable: Disposable;

    constructor(wordCounter: WordCounter) {
        this._wordCounter = wordCounter;
        this._wordCounter.updateWordCount();

        // subscribe to selection change and editor activation events
        let subscriptions: Disposable[] = [];
        window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        // create a combined disposable from both event subscriptions
        this._disposable = Disposable.from(...subscriptions);
    }

    private _onEvent(event: any) {
        console.log(event);
        this._wordCounter.updateWordCount();
    }

    public dispose() {
        this._disposable.dispose();
    }
}
