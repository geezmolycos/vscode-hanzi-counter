{
    /* ==> 简体中文 Simplified Chinese <== */
    const prefix = '<table width="100%"><tbody>';
    const suffix = '</tbody></table>';
    return prefix
        + this.tableRow('单词数:', spaced_word, '"spaced_word"')
        + this.tableRow('非ASCII字符数:', nonascii, '"nonascii"')
        + this.tableRow('中文字数:', han, '"han"')
        + this.tableRow('中文字数(含标点):', han + han_punct, '[["han"],[],["han_punct"],[],[],[],[]]')
        + this.tableRow('非空白字符数:', nonwhite, '"nonwhite"')
        + this.tableRow('总字符数:', character)
        + suffix + '\n\n'
        + this.paging.generate('zh_hans');
}
