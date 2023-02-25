{
    /* ==> 西文 Western languages <== */
    const prefix = '<table width="100%"><tbody>';
    const suffix = '</tbody></table>';
    return prefix
        + this.tableRow('Spaced words:', spaced_word, '"spaced_word"')
        + this.tableRow('Simple words:', simple_word, '"simple_word"')
        + this.tableRow('Letters:', letter, '"letter"')
        + this.tableRow('Puncts+Symbols:', punct + symbol, '"letter"', `${punct}+${symbol}=${punct + symbol}`)
        + suffix + '\n\n'
        + this.paging.generate('zh_hans');
}
