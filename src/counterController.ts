
import * as vscode from 'vscode';

import {Counter} from './counter';
import {DocumentCounter} from './documentCounter';

export class CounterController {

    private _counter: Counter;
    private _documentCounters: Map<vscode.TextDocument, DocumentCounter>;
    private _tooltipTemplateName: string | undefined;
    private _disposable: vscode.Disposable;

    constructor(counter: Counter) {
        this._counter = counter;
        this._documentCounters = new Map();

        this._tooltipTemplateName = undefined;

        // subscribe to selection change and editor activation events
        let subscriptions: vscode.Disposable[] = [];
        vscode.workspace.onDidOpenTextDocument(this._onDidOpenTextDocument, this, subscriptions);
        // remove cache when saving file for possible de-sync
        vscode.workspace.onDidSaveTextDocument(this._onDidOpenTextDocument, this, subscriptions);
        vscode.workspace.onDidCloseTextDocument(this._onDidCloseTextDocument, this, subscriptions);
        vscode.workspace.onDidChangeTextDocument(this._onDidChangeTextDocument, this, subscriptions);
        vscode.window.onDidChangeActiveTextEditor(()=>{this._updateStatusBarItem();this._counter.removeHighlight();}, this, subscriptions);
        vscode.window.onDidChangeTextEditorSelection(()=>{this._updateStatusBarItem();this._counter.removeHighlight();}, this, subscriptions);

        vscode.workspace.onDidChangeConfiguration(this._onDidChangeConfiguration, this, subscriptions);

        // some documents may be opened before we can register event handler
        for (let document of vscode.workspace.textDocuments){
            this._onDidOpenTextDocument(document);
        }
        // onDidChangeActiveTextEditor will not trigger when first open
        this._updateStatusBarItem();

        // create a combined disposable from both event subscriptions
        this._disposable = vscode.Disposable.from(...subscriptions);
    }

    private _onDidOpenTextDocument(document: vscode.TextDocument) {
        this._documentCounters.set(document, new DocumentCounter(this._counter, document));
    }
    
    private _onDidCloseTextDocument(document: vscode.TextDocument) {
        this._documentCounters.delete(document);
    }
    
    private _onDidChangeTextDocument(event: vscode.TextDocumentChangeEvent) {
        for (let change of event.contentChanges){
            this._documentCounters.get(event.document)?.onContentChange(change);
        }
        this._updateStatusBarItem();
        this._counter.removeHighlight();
    }

    private _updateDocumentCountersConfiguration(){
        try {
            for (let [document, documentCounter] of this._documentCounters){
                documentCounter.updateConfiguration();
            }
        } catch (e){
            if (e instanceof Error){
                vscode.window.showErrorMessage(e.message);
            } else {
                vscode.window.showErrorMessage('Error happened when updating configuration');
            }
        }
        this._updateStatusBarItem();
        this._counter.removeHighlight();
    }

    private _onDidChangeConfiguration(event: vscode.ConfigurationChangeEvent){
        if (event.affectsConfiguration('vscode-hanzi-counter')){
            this._updateDocumentCountersConfiguration();
        }
    }

    private _updateStatusBarItem(){
        let currentDocument = vscode.window.activeTextEditor?.document;
        if (currentDocument){
            let selections = vscode.window.activeTextEditor!.selections;
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
        this._updateStatusBarItem();
    }

    public dispose() {
        this._disposable.dispose();
    }
}
