{
    /* ==> 日本語 Japanese <== */
    const prefix = '<table width="100%"><tbody>';
    const suffix = '</tbody></table>';
    return prefix
        + this.tableRow('日本語:', han + hiragana + katakana + jp_punct, '[[],["katakana"],["hiragana"],["han"],[],["jp_punct"],[]]')
        + this.tableRow('日本語(句読点なし):', han + hiragana + katakana, '[[],["katakana"],["hiragana"],["han"],[],[],[]]')
        + this.tableRow('漢字:', han, '"han"')
        + this.tableRow('仮名(平/片):', hiragana + katakana, '[[],["katakana"],["hiragana"],[],[],[],[]]', `${this.numberWithCommas(hiragana + katakana)} (${this.numberWithCommas(hiragana)}/${this.numberWithCommas(katakana)})`)
        + this.tableRow('CJK文字:', cjk, '[["cjk"],["katakana"],["hiragana"],["han"],["hangul"],[],[]]')
        + this.tableRow('単語:', spaced_word, '"spaced_word"')
        + this.tableRow('非ASCII文字:', nonascii, '"nonascii"')
        + this.tableRow('非空白文字:', nonwhite, '"nonwhite"')
        + this.tableRow('総文字数:', character)
        + this.tableRow('符号点数:', codepoint)
        + this.tableRow('UTF-8:', utf8_1 + utf8_2*2 + utf8_3*3 + utf8_4*4, '[["utf8_1"],["utf8_4"],[],[],["utf8_3"],["utf8_2"],[]]', `${this.numberWithCommas(utf8_1 + utf8_2*2 + utf8_3*3 + utf8_4*4)}`)
        + this.utf8Row(utf8_1, utf8_2, utf8_3, utf8_4)
        + suffix + '\n\n'
        + this.paging.generate('jp');
}
