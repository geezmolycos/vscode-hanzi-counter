
import * as vscode from 'vscode';

import {Counter} from './counter';
import {DocumentCounter} from './documentCounter';

const MAX_COUNT_LENGTH = 3000000; // 3M

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
        if (document.getText().length <= MAX_COUNT_LENGTH && document.languageId !== 'code-text-binary'){
            // very large file or binary file is not counted
            this._documentCounters.set(document, new DocumentCounter(this._counter, document));
        }
    }
    
    private _onDidCloseTextDocument(document: vscode.TextDocument) {
        this._documentCounters.delete(document);
    }
    
    private _onDidChangeTextDocument(event: vscode.TextDocumentChangeEvent) {
        if (event.document.getText().length > MAX_COUNT_LENGTH || event.document.languageId === 'code-text-binary'){
            // grow big, remove record
            this._documentCounters.delete(event.document);
        } else if (!this._documentCounters.has(event.document)){
            // previously big, but currently small
            // re-add document
            this._documentCounters.set(event.document, new DocumentCounter(this._counter, event.document));
        } else {
            // already in record
            for (let change of event.contentChanges){
                this._documentCounters.get(event.document)?.onContentChange(change);
            }
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
            if (!this._documentCounters.has(currentDocument)){ // very large file is not counted
                this._counter.changeStatusBarItem(false);
                return;
            }
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
    
    public changeTooltipTemplate(name: string, isPermanent=false){
        this._tooltipTemplateName = name;
        if (isPermanent){
            vscode.workspace.getConfiguration().update(
                'vscode-hanzi-counter.template.tooltipTemplateName',
                name,
                vscode.ConfigurationTarget.Global
            );
        }
        this._updateStatusBarItem();
    }

    public dispose() {
        this._disposable.dispose();
    }
}
