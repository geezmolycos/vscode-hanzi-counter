{
    /* ==> 西文 Western languages <== */
    const prefix = '<table width="100%"><tbody>';
    const suffix = '</tbody></table>';
    return prefix
        + this.tableRow('Spaced words:', spaced_word, '"spaced_word"')
        + this.tableRow('Simple words:', simple_word, '"simple_word"')
        //+ this.tableRow('Word segments:', segmenter_word, '"segmenter_word"') // removed to reduce confusion
        + this.tableRow('Sentences:', segmenter_sentence, '"segmenter_sentence"')
        + this.tableRow('Letters:', letter, '"letter"')
        + this.tableRow('Puncts/Symbols:', punct + symbol, '[[],[],[],[],[],["punct"],["symbol"]]', `${this.numberWithCommas(punct)}/${this.numberWithCommas(symbol)}`)
        + this.tableRow('Non-ASCII:', nonascii, '"nonascii"')
        + this.tableRow('Non-white:', nonwhite, '"nonwhite"')
        + this.tableRow('Chars:', character)
        + this.tableRow('Codepoints:', codepoint)
        + this.tableRow('UTF-8:', utf8_1 + utf8_2*2 + utf8_3*3 + utf8_4*4, '[["utf8_1"],["utf8_4"],[],[],["utf8_3"],["utf8_2"],[]]', `${this.numberWithCommas(utf8_1 + utf8_2*2 + utf8_3*3 + utf8_4*4)}`)
        + this.utf8Row(utf8_1, utf8_2, utf8_3, utf8_4)
        + suffix + '\n\n'
        + this.paging.generate('western');
}
