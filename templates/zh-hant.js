{
    /* ==> 繁體中文 Traditional Chinese <== */
    const prefix = '<table width="100%"><tbody>';
    const suffix = '</tbody></table>';
    return prefix
        + this.tableRow('單詞數:', spaced_word, '"spaced_word"')
        + this.tableRow('非ASCII字符數:', nonascii, '"nonascii"')
        + this.tableRow('中文字數:', han + han_punct, '[["han"],[],["han_punct"],[],[],[],[]]')
        + this.tableRow('中文字數(不含標點):', han, '"han"')
        + this.tableRow('CJK字符數:', cjk, '[["cjk"],["han"],[],["hiragana"],["hangul"],["katakana"],[]]')
        + this.tableRow('非空白字符數:', nonwhite, '"nonwhite"')
        + this.tableRow('UTF-8:', utf8_1 + utf8_2*2 + utf8_3*3 + utf8_4*4, '[["utf8_1"],["utf8_4"],[],[],["utf8_3"],["utf8_2"],[]]', `${utf8_1 + utf8_2*2 + utf8_3*3 + utf8_4*4} (${utf8_1}/${utf8_2}/${utf8_3}/${utf8_4})`)
        + this.tableRow('總字符數:', character)
        + suffix + '\n\n'
        + this.paging.generate('zh_hant');
}
