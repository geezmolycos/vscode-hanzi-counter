{
    /* ==> 中文状态栏 Chinese Status bar <== */
    // provide switching pages functions in tooltip
    this.hlitMax = Infinity; // maximum number that has highlight enabled
    // https://stackoverflow.com/a/2901298
    this.numberWithCommas = (x) => {
        return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    };
    this.tableRow = (str, value, hlit, display) => (
        '<tr>'
        + `<td>${str}</td>`
        + (
            hlit && value < this.hlitMax
            ? `<td align="right"><a href="command:vscode-hanzi-counter.highlight?%5B${encodeURIComponent(hlit)}%5D">${display || this.numberWithCommas(value)}</a></td>`
            : `<td align="right">${display || this.numberWithCommas(value)}</td>`
        ) + '\n'
    );
    this.paging = this.paging || {
        'list': [
            ['western', '西'],
            ['zh-hans', '简'],
            ['zh-hant', '繁'],
            ['jp', '日'],
            ['kr', '韩'],
        ],
        'generate': function (current, lang=1){
            return '<div align="center">[ ' + this.list.map(e => 
                e[0] !== current
                ? `<a href="command:vscode-hanzi-counter.changeTooltip?%5B%22${e[0]}%22%5D">${e[lang]}</a>`
                : `${e[lang]}`
            ).join(' &#124; ') + ' ]</div>';
        }
    };
    return `$(pencil) ${this.numberWithCommas(character)} 字符`;
}