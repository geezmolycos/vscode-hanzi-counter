{
    /* ==> 简体中文 Simplified Chinese <== */
    const prefix = '<table width="100%"><tbody>';
    const suffix = '</tbody></table>';
    return prefix
        + this.tableRow('单词数:', spaced_word, '"spaced_word"')
        + this.tableRow('非ASCII字符数:', nonascii, '"nonascii"')
        + this.tableRow('中文字数:', han + han_punct, '[["han"],[],["han_punct"],[],[],[],[]]')
        + this.tableRow('中文字数(不含标点):', han, '"han"')
        + this.tableRow('CJK字符数:', cjk, '[["cjk"],["han"],[],["hiragana"],["hangul"],["katakana"],[]]')
        + this.tableRow('非空白字符数:', nonwhite, '"nonwhite"')
        + this.tableRow('UTF-8:', utf8_1 + utf8_2*2 + utf8_3*3 + utf8_4*4, '[["utf8_1"],["utf8_4"],[],[],["utf8_3"],["utf8_2"],[]]', `${utf8_1 + utf8_2*2 + utf8_3*3 + utf8_4*4} (${utf8_1}/${utf8_2}/${utf8_3}/${utf8_4})`)
        + this.tableRow('总字符数:', character)
        + suffix + '\n\n'
        + this.paging.generate('zh-hans');
}
