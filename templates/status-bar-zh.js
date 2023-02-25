{
    /* ==> 中文状态栏 Chinese Status bar <== */
    // provide switching pages functions in tooltip
    this.hlitMax = 10000;
    this.tableRow = (str, value, hlit, display) => (
        '<tr>'
        + `<td>${str}</td>`
        + (
            hlit && value < this.hlitMax
            ? `<td align="right"><a href="command:vscode-hanzi-counter.highlight?%5B${encodeURIComponent(hlit)}%5D">${display || value}</a></td>`
            : `<td align="right">${display || value}</td>`
        ) + '\n'
    );
    this.paging = this.paging || {
        'list': [
            ['western', '西'],
            ['western-detailed', '详'],
            ['zh-hans', '简'],
            ['zh-hans-detailed', '详'],
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
    return `$(pencil) ${character} 字符`;
}