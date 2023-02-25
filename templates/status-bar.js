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
            return '&#124; ' + this.list.map(e => 
                e[0] !== current
                ? `[${e[lang]}](command:vscode-hanzi-counter.changeTooltip?%5B%22${e[0]}%22%5D)`
                : `${e[lang]}`
            ).join(' &#124; ') + ' &#124;';
        }
    };
    return `$(pencil) Chars: ${character}`;
}