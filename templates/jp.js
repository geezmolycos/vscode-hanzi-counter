{
    /* ==> 日本語 Japanese <== */
    const prefix = '<table width="100%"><tbody>';
    const suffix = '</tbody></table>';
    return prefix
        + this.tableRow('単語数:', spaced_word, '"spaced_word"')
        + this.tableRow('非ASCII文字数:', nonascii, '"nonascii"')
        + this.tableRow('日本語文字数:', han + hiragana + katakana + jp_punct, '[["jp_punct"],["han"],[],["hiragana"],[],["katakana"],[]]')
        + this.tableRow('日本語文字数(句読点なし):', han + hiragana + katakana, '[[],["han"],[],["hiragana"],[],["katakana"],[]]')
        + this.tableRow('漢字数:', han, '"han"')
        + this.tableRow('仮名数(平/片):', hiragana + katakana, '[[],[],[],["hiragana"],[],["katakana"],[]]', `${hiragana + katakana} (${hiragana}/${katakana})`)
        + this.tableRow('CJK文字数:', cjk, '[["cjk"],["han"],[],["hiragana"],["hangul"],["katakana"],[]]')
        + this.tableRow('非空白文字数:', nonwhite, '"nonwhite"')
        + this.tableRow('UTF-8:', utf8_1 + utf8_2*2 + utf8_3*3 + utf8_4*4, '[["utf8_1"],["utf8_4"],[],[],["utf8_3"],["utf8_2"],[]]', `${utf8_1 + utf8_2*2 + utf8_3*3 + utf8_4*4} (${utf8_1}/${utf8_2}/${utf8_3}/${utf8_4})`)
        + this.tableRow('総文字数:', character)
        + suffix + '\n\n'
        + this.paging.generate('jp');
}
