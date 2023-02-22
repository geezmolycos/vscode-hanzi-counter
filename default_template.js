function a(){
    const hlitMax = 1000;
    const prefix = '|||\n|-|-:|\n';
    const line = (str, value, hlit) => (`|${str}|` + (value < hlitMax ? `[${value}](command:vscode-hanzi-counter.highlight?%5B${encodeURIComponent(hlit)}%5D)` : `${value}`));
    return prefix
        + line('单词数:', word, '"word"')
        + line('非ASCII字符数:', nonascii, '"nonascii"')
        + line('中文字数:', han, '"han"');
}
// |||\\n|-|-:|\\n|单词数：|${word}|\\n|非 ASCII 字符数：|${nonascii}|\\n|中文字数：|${han}|\\n|中文字数（含标点）：|${han + han_punct}|\\n|UTF-8 大小：|${utf8_1*1+utf8_2*2+utf8_3*3+utf8_4*4}|\\n|非空白字符数：|${nonwhite}|\\n|总字符数：|${character}|\\n[点](command:vscode-hanzi-counter.highlight?%5B%22nonwhite%22%5D)`