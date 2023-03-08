{
    /* ==> 西文 Western languages <== */
    const prefix = '<table width="100%"><tbody>';
    const suffix = '</tbody></table>';
    return prefix
        + this.tableRow('Spaced words:', spaced_word, '"spaced_word"')
        + this.tableRow('Simple words:', simple_word, '"simple_word"')
        + this.tableRow('Word segments:', segmenter_word, '"segmenter_word"')
        + this.tableRow('Sentences:', segmenter_sentence, '"segmenter_sentence"')
        + this.tableRow('Non-ASCII:', nonascii, '"nonascii"')
        + this.tableRow('Letters:', letter, '"letter"')
        + this.tableRow('Puncts/Symbols:', punct + symbol, '[[],[],[],["punct"],[],["symbol"],[]]', `${this.numberWithCommas(punct)}/${this.numberWithCommas(symbol)}`)
        + this.tableRow('Non-white:', nonwhite, '"nonwhite"')
        + this.tableRow('UTF-8:', utf8_1 + utf8_2*2 + utf8_3*3 + utf8_4*4, '[["utf8_1"],["utf8_4"],[],[],["utf8_3"],["utf8_2"],[]]', `${this.numberWithCommas(utf8_1 + utf8_2*2 + utf8_3*3 + utf8_4*4)} <small>(${this.numberWithCommas(utf8_1)}/${this.numberWithCommas(utf8_2)}/${this.numberWithCommas(utf8_3)}/${this.numberWithCommas(utf8_4)})</small>`)
        + this.tableRow('Total:', character)
        + suffix + '\n\n'
        + this.paging.generate('western');
}
