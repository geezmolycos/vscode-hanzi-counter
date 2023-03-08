{
    /* ==> 繁體中文 Traditional Chinese <== */
    const prefix = '<table width="100%"><tbody>';
    const suffix = '</tbody></table>';
    return prefix
        + this.tableRow('單詞:', spaced_word, '"spaced_word"')
        + this.tableRow('非ASCII字符:', nonascii, '"nonascii"')
        + this.tableRow('中文:', han + han_punct, '[["han"],[],["han_punct"],[],[],[],[]]')
        + this.tableRow('中文(不含標點):', han, '"han"')
        + this.tableRow('CJK字符:', cjk, '[["cjk"],["han"],[],["hiragana"],["hangul"],["katakana"],[]]')
        + this.tableRow('非空白字符:', nonwhite, '"nonwhite"')
        + this.tableRow('UTF-8:', utf8_1 + utf8_2*2 + utf8_3*3 + utf8_4*4, '[["utf8_1"],["utf8_4"],[],[],["utf8_3"],["utf8_2"],[]]', `${this.numberWithCommas(utf8_1 + utf8_2*2 + utf8_3*3 + utf8_4*4)} <small>(${this.numberWithCommas(utf8_1)}/${this.numberWithCommas(utf8_2)}/${this.numberWithCommas(utf8_3)}/${this.numberWithCommas(utf8_4)})</small>`)
        + this.tableRow('总字符數:', character)
        + suffix + '\n\n'
        + this.paging.generate('zh-hant');
}
