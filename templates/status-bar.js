{
    // provide switching pages functions in tooltip
    this.paging = this.paging || {
        'list': [
            ['overview', 'Main', '主'],
            ['zh-hans', 'Chs', '简'],
            ['zh-hant', 'Cht', '繁'],
            ['jp', 'JP', '日'],
            ['kr', 'KR', '韩'],
            ['detailed', 'Detl', '详'],
            ['detailed-zh', 'Detl', '详']
        ],
        'generate': function (current, lang=2){
            return '<div align="center">[ ' + this.list.map(e => 
                e[0] !== current
                ? `<a href="command:vscode-hanzi-counter.changeTooltip?%5B%22${e[0]}%22%5D">${e[lang]}</a>`
                : `${e[lang]}`
            ).join(' &#124; ') + ' ]</div>';
        }
    };
    return `$(pencil) Chars: ${character}`;
}