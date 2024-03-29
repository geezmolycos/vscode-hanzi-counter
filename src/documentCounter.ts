
import * as vscode from 'vscode';

import {Counter} from './counter';

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

export class DocumentCounter {

    private _counter: Counter;

    private _document: vscode.TextDocument;
    private _cachedLineCounts: Map<string, CachedLineCount>;
    
    private _enabled!: boolean;
    private _statusBarTemplateName!: string;
    private _tooltipTemplateName!: string;

    constructor(counter: Counter, document: vscode.TextDocument){
        this._counter = counter;
        this._document = document;
        this._cachedLineCounts = new Map();
        this.updateConfiguration();
    }

    public updateConfiguration(){
        let configuration = vscode.workspace.getConfiguration('', this._document);
        this._enabled = configuration.get('vscode-hanzi-counter.statusBar.enabled') as boolean;
        let statusBarTemplateName = configuration.get('vscode-hanzi-counter.template.statusBarTemplateName') as string;
        if (this._counter.templates.has(statusBarTemplateName)){
            this._statusBarTemplateName = statusBarTemplateName;
        } else {
            throw new Error(`template "${statusBarTemplateName}" does not exist`);
        }
        let tooltipTemplateName = configuration.get('vscode-hanzi-counter.template.tooltipTemplateName') as string;
        if (this._counter.templates.has(tooltipTemplateName)){
            this._tooltipTemplateName = tooltipTemplateName;
        } else {
            throw new Error(`template "${tooltipTemplateName}" does not exist`);
        }
    }

    private _getEOLString(){
        return new Map([
            [vscode.EndOfLine.LF, '\n'], [vscode.EndOfLine.CRLF, '\r\n']
        ]).get(this._document.eol);
    }

    public static addSegmentIndicators(text: string, segmenter: Intl.Segmenter){
        // add u+fdd0 before segment and u+fdd1 before word
        // remove all noncharacters that may be used to represent segment
        text = text.replace(/[\ufdd0-\ufdef]/g, '');
        let segmented = segmenter.segment(text);
        let segmentedText = '';
        for (let segmentData of segmented){
            if (segmentData.isWordLike){
                segmentedText += '\ufdd1';
            } else {
                segmentedText += '\ufdd0';
            }
            segmentedText += segmentData.segment;
        }
        return segmentedText;
    }

    public recalculateCount(regexName: string){
        // calculate and store count for each line
        let regex = this._counter.regexes.get(regexName);
        if (regex === undefined){
            throw new Error(`non-existent regex "${regexName}"`);
        }
        let segmenter = this._counter.segmenters.get(regexName);
        let normalization = this._counter.normalizations.get(regexName)?.toUpperCase();
        let lineCount = [];
        if (normalization === undefined){
            if (segmenter === undefined){
                for (let lineNumber = 0; lineNumber < this._document.lineCount; ++lineNumber){
                    let lineText = this._document.getText(new vscode.Range(lineNumber, 0, lineNumber + 1, 0));
                    let matchCount = lineText.match(regex)?.length ?? 0;
                    lineCount.push(matchCount);
                }
            } else {
                for (let lineNumber = 0; lineNumber < this._document.lineCount; ++lineNumber){
                    let lineText = this._document.getText(new vscode.Range(lineNumber, 0, lineNumber + 1, 0));
                    lineText = DocumentCounter.addSegmentIndicators(lineText, segmenter);
                    let matchCount = lineText.match(regex)?.length ?? 0;
                    lineCount.push(matchCount);
                }
            }
        } else {
            if (segmenter === undefined){
                for (let lineNumber = 0; lineNumber < this._document.lineCount; ++lineNumber){
                    let lineText = this._document.getText(new vscode.Range(lineNumber, 0, lineNumber + 1, 0)).normalize(normalization);
                    let matchCount = lineText.match(regex)?.length ?? 0;
                    lineCount.push(matchCount);
                }
            } else {
                for (let lineNumber = 0; lineNumber < this._document.lineCount; ++lineNumber){
                    let lineText = this._document.getText(new vscode.Range(lineNumber, 0, lineNumber + 1, 0)).normalize(normalization);
                    lineText = DocumentCounter.addSegmentIndicators(lineText, segmenter);
                    let matchCount = lineText.match(regex)?.length ?? 0;
                    lineCount.push(matchCount);
                }
            }
        }
        this._cachedLineCounts.set(regexName, new CachedLineCount(lineCount));
    }

    public onContentChange(event: vscode.TextDocumentContentChangeEvent){
        // update cached line counts according to change
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
            let segmenter = this._counter.segmenters.get(regexName);
            let normalization = this._counter.normalizations.get(regexName)?.toUpperCase();
            let lineCount = [];
            if (normalization === undefined){
                if (segmenter === undefined){
                    for (let lineNumber = affectedLineStart; lineNumber < affectedLineStart + newTextLineCount; ++lineNumber){
                        let lineText = this._document.getText(new vscode.Range(lineNumber, 0, lineNumber + 1, 0));
                        let matchCount = lineText.match(regex)?.length ?? 0;
                        lineCount.push(matchCount);
                    }
                } else {
                    for (let lineNumber = affectedLineStart; lineNumber < affectedLineStart + newTextLineCount; ++lineNumber){
                        let lineText = this._document.getText(new vscode.Range(lineNumber, 0, lineNumber + 1, 0));
                        lineText = DocumentCounter.addSegmentIndicators(lineText, segmenter);
                        let matchCount = lineText.match(regex)?.length ?? 0;
                        lineCount.push(matchCount);
                    }
                }
            } else {
                if (segmenter === undefined){
                    for (let lineNumber = affectedLineStart; lineNumber < affectedLineStart + newTextLineCount; ++lineNumber){
                        let lineText = this._document.getText(new vscode.Range(lineNumber, 0, lineNumber + 1, 0)).normalize(normalization);
                        let matchCount = lineText.match(regex)?.length ?? 0;
                        lineCount.push(matchCount);
                    }
                } else {
                    for (let lineNumber = affectedLineStart; lineNumber < affectedLineStart + newTextLineCount; ++lineNumber){
                        let lineText = this._document.getText(new vscode.Range(lineNumber, 0, lineNumber + 1, 0)).normalize(normalization);
                        lineText = DocumentCounter.addSegmentIndicators(lineText, segmenter);
                        let matchCount = lineText.match(regex)?.length ?? 0;
                        lineCount.push(matchCount);
                    }
                }
            }
            lineCounts.replace(affectedLineStart, affectedLineEnd + 1, lineCount);
        }
    }

    public getCount(regexName: string, range?: vscode.Range){
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
                partialAfter = new vscode.Range(range.end, range.end);
                fullLineCount = 0;
            } else {
                partialBefore = new vscode.Range(range.start, new vscode.Position(fullLineStart, 0));
                partialAfter = new vscode.Range(new vscode.Position(fullLineEnd, 0), range.end);
                fullLineCount = this._cachedLineCounts.get(regexName)!.getRangeSum(fullLineStart, fullLineEnd);
            }

            let segmenter = this._counter.segmenters.get(regexName);
            let normalization = this._counter.normalizations.get(regexName)?.toUpperCase();

            let beforeText = this._document.getText(partialBefore);
            if (normalization){
                beforeText = beforeText.normalize(normalization);
            }
            if (segmenter){
                beforeText = DocumentCounter.addSegmentIndicators(beforeText, segmenter);
            }
            let beforeCount = beforeText.match(this._counter.regexes.get(regexName)!)?.length ?? 0;

            let afterText = this._document.getText(partialAfter);
            if (normalization){
                afterText = afterText.normalize(normalization);
            }
            if (segmenter){
                afterText = DocumentCounter.addSegmentIndicators(afterText, segmenter);
            }
            let afterCount = afterText.match(this._counter.regexes.get(regexName)!)?.length ?? 0;

            return beforeCount + fullLineCount + afterCount;
        }
    }

    public getCountOfRanges(regexName: string, ranges?: readonly vscode.Range[]){
        if (ranges === undefined){
            return this.getCount(regexName);
        }
        let sum = 0;
        for (let range of ranges){
            sum += this.getCount(regexName, range);
        }
        return sum;
    }

    public updateStatusBarItem(tooltipTemplateName?: string, ranges?: readonly vscode.Range[]){
        if (!this._enabled){
            this._counter.changeStatusBarItem(false);
            return;
        }
        this._counter.changeStatusBarItem(true);

        let cachedCounts = new Map();

        let templateArguments = this._counter.templateParameters.map(
            s => cachedCounts.get(s) ?? cachedCounts.set(s, this.getCountOfRanges(s, ranges)).get(s)
        );
        let countMap = new Map(this._counter.templateParameters.map(
            (e, i) => [e, templateArguments[i]]
        ));
        
        this._counter.templateEnvironment.count = countMap; // pass counts as map to environment for advanced scripting
        let statusBarTemplate = this._counter.templates.get(this._statusBarTemplateName);
        if (statusBarTemplate !== undefined){
            try {
                this._counter.updateStatusBarItem(statusBarTemplate.apply(this._counter.templateEnvironment, templateArguments), undefined);
            } catch (e){
                if (e instanceof Error){
                    vscode.window.showErrorMessage('Error happened when evaluating status bar template: ' + e.message);
                } else {
                    vscode.window.showErrorMessage('Error happened when evaluating status bar template');
                }
            }
        }

        // provide template name stored in configuration file
        let defaultTooltipTemplateName = vscode.workspace.getConfiguration('', this._document)
            .get('vscode-hanzi-counter.template.tooltipTemplateName') as string;
        
        this._counter.templateEnvironment.defaultTooltipTemplateName = defaultTooltipTemplateName;

        tooltipTemplateName ??= this._tooltipTemplateName;
        let tooltipTemplate = this._counter.templates.get(tooltipTemplateName);
        if (tooltipTemplate !== undefined){
            try {
                this._counter.updateStatusBarItem(undefined, tooltipTemplate.apply(this._counter.templateEnvironment, templateArguments));
            } catch (e){
                if (e instanceof Error){
                    vscode.window.showErrorMessage('Error happened when evaluating tooltip template: ' + e.message);
                } else {
                    vscode.window.showErrorMessage('Error happened when evaluating tooltip template');
                }
            }
        }
    }
}
