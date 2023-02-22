
import * as vscode from 'vscode';

import {Counter} from './counter';
import {DocumentCounter} from './documentCounter';
import {CounterController} from './counterController';

// this method is called when your extension is activated. activation is
// controlled by the activation events defined in package.json
export function activate(context: vscode.ExtensionContext) {

    // create a new word counter
    let counter = new Counter(vscode.workspace.getConfiguration());
    let controller = new CounterController(counter);

    // add to a list of disposables which are disposed when this extension
    // is deactivated again.
    context.subscriptions.push(controller);
    context.subscriptions.push(counter);

    let changeTooltip = vscode.commands.registerCommand('vscode-hanzi-counter.changeTooltip', (templateName) => {
        if (counter.templates.has(templateName)){
            controller.changeTooltipTemplate(templateName);
        } else {
            vscode.window.showErrorMessage(
                `Tooltip template "${templateName}" does not exist. Please change your command according to names in the configuration.`,
                'Open settings'
            ).then((yes) => {
                if (yes){
                    vscode.commands.executeCommand('workbench.action.openSettings', 'vscode-hanzi-counter');
                }
            });
        }
	});

	context.subscriptions.push(changeTooltip);

    let showFind = vscode.commands.registerCommand('vscode-hanzi-counter.highlight', (regexName) => {
        counter.setHighlightRegex(regexName);
	});

	context.subscriptions.push(showFind);
}
