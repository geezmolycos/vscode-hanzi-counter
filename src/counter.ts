
import * as vscode from 'vscode';

const MAX_HIGHLIGHT_COUNT = 20000;
const MAX_HIGHLIGHT_COUNT_VISIBLE = 20000;

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

export class Counter {

    public readonly regexes: Map<string, RegExp>;
    public readonly templateParameters: string[];
    public readonly templates: Map<string, Function>;

    private _statusBarItem: vscode.StatusBarItem;
    private _decorationType: vscode.TextEditorDecorationType;

    constructor(configuration: vscode.WorkspaceConfiguration) {
        // read and parse configurations
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

        // create status bar item
        this._statusBarItem = vscode.window.createStatusBarItem(
            configuration.get('vscode-hanzi-counter.statusBar.alignment') === 'left'
                ? vscode.StatusBarAlignment.Left : vscode.StatusBarAlignment.Right,
            configuration.get('vscode-hanzi-counter.statusBar.priority') ?? 105); // default left of text attributes(ln, col, spaces, encoding, etc)
        this._statusBarItem.name = 'Hanzi Counter';

        // create decoration type
        this._decorationType = vscode.window.createTextEditorDecorationType({
            // To be implemented
            'backgroundColor': new vscode.ThemeColor('editor.findMatchHighlightBackground'),
            'borderColor': new vscode.ThemeColor('editor.findMatchHighlightBorder'),
            // https://github.com/microsoft/vscode/blob/3b4a151ea027219579234f1002f2c955ad2021ee/src/vs/editor/contrib/find/browser/findWidget.ts#L1400
            'border': (
                vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.HighContrast
                || vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.HighContrastLight
            ) ? '1px solid' : '1px dotted',
            'overviewRulerColor': new vscode.ThemeColor('editorOverviewRuler.findMatchForeground'),
            // should 
            'rangeBehavior': vscode.DecorationRangeBehavior.ClosedClosed
        });
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
            let ms = new vscode.MarkdownString(tooltipText);
            ms.isTrusted = true;
            ms.supportHtml = true;
            ms.supportThemeIcons = true;
            this._statusBarItem.tooltip = ms;
        }
    }

    public setHighlight(ranges: readonly vscode.Range[]){
        vscode.window.activeTextEditor?.setDecorations(this._decorationType, ranges);
    }

    public removeHighlight(){
        this.setHighlight([]);
    }

    public setHighlightRegex(regexName: string){
        let regex = this.regexes.get(regexName);
        if (regex === undefined){
            throw new Error(`no regex with name ${regexName}`);
        }
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
            let selectionRanges: vscode.Range[] = selections.slice();
            if (allEmpty){ // no text is selected
                selectionRanges = [new vscode.Range(0, 0, currentDocument.lineCount, 0)]; // entire document
            }
            let highlightRanges: vscode.Range[] = [];
            let addSelectionRangeHighlight = (selectionRange: vscode.Range, maxCount: number) => {
                let startOffset = currentDocument!.offsetAt(selectionRange.start);
                let text = currentDocument!.getText(selectionRange);
                for (let match of text.matchAll(regex!)){
                    let matchStartIndex = match.index!;
                    let matchEndIndex = match.index! + match[0].length;
                    let matchRange = new vscode.Range(
                        currentDocument!.positionAt(startOffset + matchStartIndex),
                        currentDocument!.positionAt(startOffset + matchEndIndex)    
                    );
                    highlightRanges.push(matchRange);
                    if (highlightRanges.length >= maxCount){
                        // too many highlight ranges, give up
                        return false;
                    }
                }
                return true;
            };
            for (let selectionRange of selectionRanges){
                addSelectionRangeHighlight(selectionRange, MAX_HIGHLIGHT_COUNT);
            }
            // consider visible regions
            if (highlightRanges.length >= MAX_HIGHLIGHT_COUNT){
                for (let visibleRange of vscode.window.activeTextEditor!.visibleRanges){
                    let hasSpaceLeft = addSelectionRangeHighlight(visibleRange, MAX_HIGHLIGHT_COUNT + MAX_HIGHLIGHT_COUNT_VISIBLE);
                    if (!hasSpaceLeft){
                        break;
                    }
                }
            }
            this.setHighlight(highlightRanges);
        }
    }

    public dispose() {
        this._statusBarItem.dispose();
    }
}
