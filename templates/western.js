{
    /* ==> 西文 Western languages <== */
    const prefix = '<table width="100%"><tbody>';
    const suffix = '</tbody></table>';
    return prefix
        + this.tableRow('Spaced words:', spaced_word, '"spaced_word"')
        + this.tableRow('Simple words:', simple_word, '"simple_word"')
        + this.tableRow('Non-ASCII:', nonascii, '"nonascii"')
        + this.tableRow('Letters:', letter, '"letter"')
        + this.tableRow('Puncts+Symbols:', punct + symbol, '[[],[],[],["punct"],[],["symbol"],[]]', `${punct}+${symbol}=${punct + symbol}`)
        + this.tableRow('Non-white:', nonwhite, '"nonwhite"')
        + this.tableRow('UTF-8:', utf8_1 + utf8_2*2 + utf8_3*3 + utf8_4*4, '[["utf8_1"],["utf8_4"],[],[],["utf8_3"],["utf8_2"],[]]', `${utf8_1 + utf8_2*2 + utf8_3*3 + utf8_4*4} (${utf8_1}/${utf8_2}/${utf8_3}/${utf8_4})`)
        + this.tableRow('Total:', character)
        + suffix + '\n\n'
        + this.paging.generate('zh_hans');
}
