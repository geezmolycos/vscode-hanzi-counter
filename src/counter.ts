
import * as vscode from 'vscode';
import { DocumentCounter } from './documentCounter';

const MAX_HIGHLIGHT_COUNT = 20000;
const MAX_HIGHLIGHT_TEXT_LENGTH = 200000;
const MAX_HIGHLIGHT_COUNT_VISIBLE = 20000;

type NormalizationForm = 'nfd' | 'nfc' | 'nfkd' | 'nfkc';

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
    public readonly segmenters: Map<string, Intl.Segmenter | undefined>; // Intl.segmenter configurations
    public readonly normalizations: Map<string, NormalizationForm | undefined>; // regex norm modifier

    public readonly templateParameters: string[]; // parameter names list for template functions
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
        this.normalizations = new Map();
        this.segmenters = new Map();
        this.templateParameters = [];
        for (let [k, v] of regexStrings){
            let result = k.split('@');
            if (this.regexes.has(result[0])){
                throw new Error(`regex table contains same keys "${result[0]}"`)
            }

            // set regex map item
            this.regexes.set(result[0], new RegExp(v, 'gus'));
            this.segmenters.set(result[0], undefined);
            this.normalizations.set(result[0], undefined);
            this.templateParameters.push(result[0]);
            // has segment
            if (result.length >= 2 && result[1].length > 0){
                let granularity = new Map<string, Intl.SegmenterOptions['granularity']>([
                    ['g', 'grapheme'],
                    ['w', 'word'],
                    ['s', 'sentence']
                ]).get(result[1][0]);
                if (granularity === undefined){
                    throw new Error(`invalid granularity code for segment "${result[1][0]}" in regex "${k}", it must be one of "gws"`);
                }
                let locale = result[1].substring(1) || undefined;
                this.segmenters.set(result[0], new Intl.Segmenter(locale, {"granularity": granularity}));
            }
            // has normalization form modifier
            if (result.length >= 3 && result[2].length > 0){
                result[2] = result[2].toLowerCase();
                if (result[2] !== 'nfc' && result[2] !== 'nfd' && result[2] !== 'nfkd' && result[2] !== 'nfkc'){
                    throw new Error(`invalid normalization form "${result[2]}"`);
                }
                let normForm: NormalizationForm = result[2] as NormalizationForm;
                this.normalizations.set(result[0], normForm);
            }
        }

        const templateStrings = new Map(Object.entries(
            configuration.get('vscode-hanzi-counter.counter.templates') as object
        ));
        this.templates = new Map();
        for (let [k, v] of templateStrings){
            this.templates.set(k, compileTemplateFunction(this.templateParameters, v));
        }

        // environment for template function to store variables
        this.templateEnvironment = {'regexes': this.regexes, 'templatesParameters': this.templateParameters, 'templates': this.templates, 'segmenters': this.segmenters};

        // create status bar item
        this._statusBarItem = vscode.window.createStatusBarItem(
            configuration.get('vscode-hanzi-counter.statusBar.alignment') === 'left'
                ? vscode.StatusBarAlignment.Left : vscode.StatusBarAlignment.Right,
            configuration.get('vscode-hanzi-counter.statusBar.priority') ?? 105); // default left of text attributes(ln, col, spaces, encoding, etc)
        this._statusBarItem.name = 'Hanzi Counter';
        this._statusBarItem.accessibilityInformation = {label: 'Hanzi Counter'};

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
            this._statusBarItem.accessibilityInformation = {label: text};
        }
        if (tooltipText){
            let ms = new vscode.MarkdownString('<!--[Fake link](#)-->\n' + tooltipText);
            // The "Fake link" part is to let vscode think it contains a markdown link
            // so that the tooltip pop-up will stay open on mouse leave
            // Reference: https://github.com/microsoft/vscode/blob/d1aa00acef8b2cfa88621c448b8fd8cd034f60a9/src/vs/workbench/services/hover/browser/hoverWidget.ts#L205
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
        let regexGroups = regexGroupList.map(rList => rList.map(
            r => [this.regexes.get(r), this.segmenters.get(r), this.normalizations.get(r)] as
            [RegExp | undefined, Intl.Segmenter | undefined, NormalizationForm | undefined]
        ));
        let currentDocument = vscode.window.activeTextEditor?.document;
        if (currentDocument){
            let eolString: string = new Map([
                [vscode.EndOfLine.LF, '\n'], [vscode.EndOfLine.CRLF, '\r\n']
            ]).get(currentDocument.eol)!;
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
                for (let regexTuple of regexes){
                    if (!regexTuple[0]){
                        continue;
                    }
                    let addSelectionRangeHighlight = (selectionRange: vscode.Range, maxCount: number) => {
                        let [regex, segmenter, norm] = regexTuple;
                        let normalization = norm?.toUpperCase();
                        let startOffset = currentDocument!.offsetAt(selectionRange.start);
                        let text = currentDocument!.getText(selectionRange);
                        if (text.length > MAX_HIGHLIGHT_TEXT_LENGTH){
                            text = text.substring(0, MAX_HIGHLIGHT_TEXT_LENGTH);
                        }

                        // normalization form processing
                        // calculate string position lookup, similar to segmenter
                        let getBeforeNormalizationOffset: (offset: number) => number;

                        if (normalization === undefined){
                            getBeforeNormalizationOffset = (offset) => offset;
                        } else if (normalization === 'nfd' || normalization === 'nfkd') {
                            let beforeText = text;
                            let beforeTextIterator = beforeText[Symbol.iterator]();
                            let afterText = text.normalize(normalization);
                            text = afterText;
                            let beforeOffset = 0;
                            let afterOffset = 0;
                            getBeforeNormalizationOffset = (offset) => { // works for nfd and nfkd
                                while (offset > afterOffset){
                                    let bef = beforeTextIterator.next().value; // handles utf-16 surrogate pair
                                    let aft = bef.normalize(normalization);
                                    beforeOffset += bef.length;
                                    afterOffset += aft.length;
                                }
                                return beforeOffset;
                            };
                        } else {
                            let beforeText = text;
                            let beforeTextIterator = beforeText[Symbol.iterator]();
                            let dNormalization = normalization.replace('C', 'D');
                            let dText = text.normalize(dNormalization);
                            let cText = dText.normalize(normalization);
                            text = cText;
                            let beforeOffset = 0;
                            let dOffset = 0;
                            let dcOffset = 0;
                            let cOffset = 0;
                            getBeforeNormalizationOffset = (offset) => {
                                // this is somewhat difficult to explain
                                // if you need to understand this piece of code
                                // wish you good luck
                                let cNew = cText.substring(cOffset, offset);
                                let dcNew = cNew.normalize(dNormalization);
                                cOffset += cNew.length;
                                dcOffset += dcNew.length;
                                while (dcOffset > dOffset){
                                    let bef = beforeTextIterator.next().value;
                                    let d = bef.normalize(dNormalization);
                                    beforeOffset += bef.length;
                                    dOffset += d.length;
                                }
                                return beforeOffset;
                            };
                        }

                        let getBeforeSegmentingOffset: (offset: number) => number, getSegmentEndOffset: (offset: number) => number;
                        // segment text
                        if (segmenter !== undefined){
                            let textLines = text.split(eolString);
                            let segmentText = '';
                            // split to lines for faster segmenting
                            // Intl.Segmenter is slow for large input
                            for (let line of textLines){
                                let lineSegmentText = DocumentCounter.addSegmentIndicators(line, segmenter);
                                segmentText += lineSegmentText + eolString;
                            }
                            text = segmentText.substring(0, segmentText.length - eolString.length); // remove final eol string
                            let indicatorMatches = Array.from(text.matchAll(/[\ufdd0-\ufdef]/g));
                            let sentinel: RegExpMatchArray = ['\ufdd0'];
                            sentinel.index = text.length;
                            indicatorMatches.push(sentinel);
                            let nextIndicatorOffset = indicatorMatches[0].index ?? Infinity;
                            let indicatorCount = 0;
                            // offset must not decrease for correct result
                            getBeforeSegmentingOffset = (offset: number) => {
                                if (offset === nextIndicatorOffset){
                                    return offset - indicatorCount;
                                }
                                if (offset < nextIndicatorOffset){
                                    return offset - indicatorCount;
                                }
                                while (offset > nextIndicatorOffset){
                                    indicatorCount += 1;
                                    nextIndicatorOffset = indicatorMatches[indicatorCount].index ?? Infinity;
                                }
                                return getBeforeSegmentingOffset(offset);
                            };
                            // get segment end if character at offset is segment indicator
                            getSegmentEndOffset = (offset: number) => {
                                let maybeIndicatorOffset = getBeforeSegmentingOffset(offset - 1);
                                if (offset - 1 === nextIndicatorOffset){ // match ends with indicator
                                    return (indicatorMatches[indicatorCount + 1].index ?? Infinity) - indicatorCount - 1;
                                }
                                return getBeforeSegmentingOffset(offset);
                            };
                        } else {
                            // no segmenter, range is as before
                            getBeforeSegmentingOffset = getSegmentEndOffset = (offset: number) => {
                                return offset;
                            };
                        }
                        for (let match of text.matchAll(regex!)){
                            let matchStartIndex = getBeforeNormalizationOffset(getBeforeSegmentingOffset(match.index!));
                            let matchEndIndex = getBeforeNormalizationOffset(getSegmentEndOffset(match.index! + match[0].length));
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
