{
    /* ==> 繁體中文 Traditional Chinese <== */
    const prefix = '<table width="100%"><tbody>';
    const suffix = '</tbody></table>';
    return prefix
        + this.tableRow('字詞數:', cjk + cjk_punct + segmenter_word, '[["cjk"],[],[],[],[],["cjk_punct"],["segmenter_word"]]')
        + this.tableRow('漢字:', han + han_punct, '[["han"],[],[],[],[],["han_punct"],[]]')
        + this.tableRow('漢字(不含標點):', han, '"han"')
        + this.tableRow('CJK字符:', cjk, '[["cjk"],["katakana"],["hiragana"],["han"],["hangul"],[],[]]')
        + this.tableRow('非空白字符:', nonwhite, '"nonwhite"')
        + this.tableRow('字符數:', character)
        + this.tableRow('非ASCII碼位:', nonascii, '"nonascii"')
        + this.tableRow('碼位數:', codepoint)
        // + this.tableRow('UTF-8:', utf8_1 + utf8_2*2 + utf8_3*3 + utf8_4*4, '[["utf8_1"],["utf8_4"],[],[],["utf8_3"],["utf8_2"],[]]', `${this.numberWithCommas(utf8_1 + utf8_2*2 + utf8_3*3 + utf8_4*4)}`)
        // + this.utf8Row(utf8_1, utf8_2, utf8_3, utf8_4)
        + suffix + '\n\n'
        + this.paging.generate('zh-hant');
}
