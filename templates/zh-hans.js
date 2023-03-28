{
    /* ==> 简体中文 Simplified Chinese <== */
    const prefix = '<table width="100%"><tbody>';
    const suffix = '</tbody></table>';
    return prefix
        + this.tableRow('中文:', han + han_punct, '[["han"],[],[],[],[],["han_punct"],[]]')
        + this.tableRow('中文(不含标点):', han, '"han"')
        + this.tableRow('CJK字符:', cjk, '[["cjk"],["katakana"],["hiragana"],["han"],["hangul"],[],[]]')
        + this.tableRow('单词:', spaced_word, '"spaced_word"')
        + this.tableRow('非空白字符:', nonwhite, '"nonwhite"')
        + this.tableRow('字符数:', character)
        + this.tableRow('非ASCII码位:', nonascii, '"nonascii"')
        + this.tableRow('码位数:', codepoint)
        + this.tableRow('UTF-8:', utf8_1 + utf8_2*2 + utf8_3*3 + utf8_4*4, '[["utf8_1"],["utf8_4"],[],[],["utf8_3"],["utf8_2"],[]]', `${this.numberWithCommas(utf8_1 + utf8_2*2 + utf8_3*3 + utf8_4*4)}`)
        + this.utf8Row(utf8_1, utf8_2, utf8_3, utf8_4)
        + suffix + '\n\n'
        + this.paging.generate('zh-hans');
}
