{
    /* ==> 中文状态栏 Chinese Status bar <== */
    // provide switching pages functions in tooltip
    this.hlitMax = Infinity; // maximum number that has highlight enabled
    // https://stackoverflow.com/a/2901298
    this.numberWithCommas = (x) => {
        return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    };
    this.bigsmall = (x, is) => is ? '<small>' + x + '</small>' : x;
    this.tableRow = (str, value, hlit, display, small) => (
        '<tr>'
        + `<td>${this.bigsmall(str, small)}</td>`
        + (
            hlit && value < this.hlitMax
            ? `<td align="right"><a href="command:vscode-hanzi-counter.highlight?%5B${encodeURIComponent(hlit)}%5D">${display || this.numberWithCommas(value)}</a></td>`
            : `<td align="right">${display || this.numberWithCommas(value)}</td>`
        ) + '\n'
    );
    this.utf8Row = (utf8_1, utf8_2, utf8_3, utf8_4) => (
        `<tr><td></td><td align="right"><small><a href="command:vscode-hanzi-counter.highlight?${encodeURIComponent('[[["utf8_1"],[],[],[],[],[],[]]]')}">${this.numberWithCommas(utf8_1)}</a> · <a href="command:vscode-hanzi-counter.highlight?${encodeURIComponent('[[[],[],[],[],[],["utf8_2"],[]]]')}">${this.numberWithCommas(utf8_2)}</a> · <a href="command:vscode-hanzi-counter.highlight?${encodeURIComponent('[[[],[],[],[],["utf8_3"],[],[]]]')}">${this.numberWithCommas(utf8_3)}</a> · <a href="command:vscode-hanzi-counter.highlight?${encodeURIComponent('[[[],["utf8_4"],[],[],[],[],[]]]')}">${this.numberWithCommas(utf8_4)}</a></small></td></tr>`
    );
    this.paging = this.paging || {
        'list': [
            ['western', '西'],
            ['zh-hans', '简'],
            ['zh-hant', '繁'],
            ['jp', '日'],
            ['kr', '韩'],
        ],
        'generate': (current, lang=1) => {
            return '<div align="center">[ ' + this.paging.list.map(e => 
                e[0] !== current
                ? `<a href="command:vscode-hanzi-counter.changeTooltip?%5B%22${e[0]}%22%5D">${e[lang]}</a>`
                : `${e[lang]}`
            ).join(' &#124; ') + ' ] ' + (this.defaultTooltipTemplateName === current ? '<span style="color:#00000000;"><small>设为默认</small></span>' : `<span><a href="command:vscode-hanzi-counter.changeTooltip?%5B%22${current}%22%2C%20true%5D"><small>设为默认</small></a></span>`);
        }
    };
    return `$(pencil) ${this.numberWithCommas(character)} 字符`;
}