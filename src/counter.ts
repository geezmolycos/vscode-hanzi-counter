
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
    public readonly templateEnvironment: {[key: string]: any};

    private _statusBarItem: vscode.StatusBarItem;
    private _decorationTypes: vscode.TextEditorDecorationType[];

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

        // environment for template function to store variables
        this.templateEnvironment = {'regexes': this.regexes, 'templatesParameters': this.templateParameters, 'templates': this.templates};

        // create status bar item
        this._statusBarItem = vscode.window.createStatusBarItem(
            configuration.get('vscode-hanzi-counter.statusBar.alignment') === 'left'
                ? vscode.StatusBarAlignment.Left : vscode.StatusBarAlignment.Right,
            configuration.get('vscode-hanzi-counter.statusBar.priority') ?? 105); // default left of text attributes(ln, col, spaces, encoding, etc)
        this._statusBarItem.name = 'Hanzi Counter';

        // create decoration type
        this._decorationTypes = [
            ['', 'editor.findMatchHighlightBackground', 'charts.foreground', 'charts.foreground'],
            ['', 'editor.findMatchHighlightBackground', 'charts.red', 'charts.red'],
            ['', 'editor.findMatchHighlightBackground', 'charts.orange', 'charts.orange'],
            ['', 'editor.findMatchHighlightBackground', 'charts.yellow', 'charts.yellow'],
            ['', 'editor.findMatchHighlightBackground', 'charts.green', 'charts.green'],
            ['', 'editor.findMatchHighlightBackground', 'charts.blue', 'charts.blue'],
            ['', 'editor.findMatchHighlightBackground', 'charts.purple', 'charts.purple'],
        ].map(([color, background, border, ruler]) => vscode.window.createTextEditorDecorationType({
            'color': color ? new vscode.ThemeColor(color) : undefined,
            'backgroundColor': new vscode.ThemeColor(background),
            'borderColor': new vscode.ThemeColor(border),
            'borderWidth': '0 0 0.5em 0',
            'borderStyle': 'solid',
            'overviewRulerColor': new vscode.ThemeColor(ruler),
            // should not extend
            'rangeBehavior': vscode.DecorationRangeBehavior.ClosedClosed
        }));
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

    public setHighlight(ranges: readonly vscode.Range[], typeNumber: number){
        vscode.window.activeTextEditor?.setDecorations(this._decorationTypes[typeNumber], ranges);
    }

    public removeHighlight(){
        for (let i = 0; i < this._decorationTypes.length; ++i){
            this.setHighlight([], i);
        }
    }

    public setHighlightRegex(regexNames: string | string[] | string[][]){
        this.removeHighlight();
        let regexGroupList: string[][];
        if (typeof regexNames === 'string'){
            regexGroupList = [[regexNames]];
        } else if (regexNames.length === 0){
            return;
        } else if (typeof regexNames[0] === 'string'){
            regexGroupList = regexNames.map(_ => [_]) as string[][];
        } else {
            regexGroupList = regexNames as string[][];
        }
        let regexGroups = regexGroupList.map(rList => rList.map(r => this.regexes.get(r)));
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
            for (let i = 0; i < regexGroups.length; ++i){
                let regexes = regexGroups[i];
                if (!regexes){
                    continue;
                }
                let highlightRanges: vscode.Range[] = [];
                for (let regex of regexes){
                    if (!regex){
                        continue;
                    }
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
                }
                this.setHighlight(highlightRanges, i);
            }
        }
    }

    public dispose() {
        this._statusBarItem.dispose();
        for (let t of this._decorationTypes){
            t.dispose();
        }
    }
}
