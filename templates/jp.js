{
    /* ==> 日本語 Japanese <== */
    const prefix = '<table width="100%"><tbody>';
    const suffix = '</tbody></table>';
    return prefix
        + this.tableRow('単語:', spaced_word, '"spaced_word"')
        + this.tableRow('非ASCII文字:', nonascii, '"nonascii"')
        + this.tableRow('日本語:', han + hiragana + katakana + jp_punct, '[["jp_punct"],["han"],[],["hiragana"],[],["katakana"],[]]')
        + this.tableRow('日本語(句読点なし):', han + hiragana + katakana, '[[],["han"],[],["hiragana"],[],["katakana"],[]]')
        + this.tableRow('漢字:', han, '"han"')
        + this.tableRow('仮名(平/片):', hiragana + katakana, '[[],[],[],["hiragana"],[],["katakana"],[]]', `${this.numberWithCommas(hiragana + katakana)} (${this.numberWithCommas(hiragana)}/${this.numberWithCommas(katakana)})`)
        + this.tableRow('CJK文字:', cjk, '[["cjk"],["han"],[],["hiragana"],["hangul"],["katakana"],[]]')
        + this.tableRow('非空白文字:', nonwhite, '"nonwhite"')
        + this.tableRow('UTF-8:', utf8_1 + utf8_2*2 + utf8_3*3 + utf8_4*4, '[["utf8_1"],["utf8_4"],[],[],["utf8_3"],["utf8_2"],[]]', `${this.numberWithCommas(utf8_1 + utf8_2*2 + utf8_3*3 + utf8_4*4)} <small>(${this.numberWithCommas(utf8_1)}/${this.numberWithCommas(utf8_2)}/${this.numberWithCommas(utf8_3)}/${this.numberWithCommas(utf8_4)})</small>`)
        + this.tableRow('総文字数:', character)
        + suffix + '\n\n'
        + this.paging.generate('jp');
}
