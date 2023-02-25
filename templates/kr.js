{
    /* ==> 한국어/조선어 Korean <== */
    const prefix = '<table width="100%"><tbody>';
    const suffix = '</tbody></table>';
    return prefix
        + this.tableRow('단어수:', spaced_word, '"spaced_word"')
        + this.tableRow('비ASCII 글자수:', nonascii, '"nonascii"')
        + this.tableRow('한글 글자수(구두점 아님):', hangul, '[["hangul"],[],[],[],[],[],[]]')
        + this.tableRow('한글 글자수:', hangul + hangul_punct, '[["hangul"],[],[],[],["hangul_punct"],[],[]]')
        + this.tableRow('한자와 한글수:', han + hangul + hangul_punct, '[["hangul"],["han"],[],[],["hangul_punct"],[],[]]')
        + this.tableRow('CJK문자수:', cjk, '[["cjk"],["han"],[],["hiragana"],["hangul"],["katakana"],[]]')
        + this.tableRow('공백이 아닌 문자수:', nonwhite, '"nonwhite"')
        + this.tableRow('UTF-8:', utf8_1 + utf8_2*2 + utf8_3*3 + utf8_4*4, '[["utf8_1"],["utf8_4"],[],[],["utf8_3"],["utf8_2"],[]]', `${utf8_1 + utf8_2*2 + utf8_3*3 + utf8_4*4} (${utf8_1}/${utf8_2}/${utf8_3}/${utf8_4})`)
        + this.tableRow('총문자수:', character)
        + suffix + '\n\n'
        + this.paging.generate('kr');
}
