/* ==> 功能概览 Feature overview <== */
`
欢迎使用，下面向你展示该字数统计扩展的功能。\n
\n
修改文件时，以下内容会随字数变化而变化：\n
- 单词数：[${spaced_word}](command:vscode-hanzi-counter.highlight?%5B%22spaced_word%22%5D)\n
- 汉字数(包括标点)：[${han + han_punct}](command:vscode-hanzi-counter.highlight?%5B${encodeURIComponent('[["han"],[],["han_punct"],[],[],[],[]]')}%5D)\n
\n
点击上面的数字，可以高亮对应的文本。\n
\n
使用前要先[设置默认提示框模板](command:workbench.action.openSettings?${encodeURIComponent('["vscode-hanzi-counter.template"]')})。\n
\n
将 \`Tooltip Template Name\` 框中默认的 \`overview\` 修改为 \`Templates\` 设置中想要显示的某一项的名字（左边一列的英文）即可。\n
\n
Welcome to use. This page is a little demo of the extension capabilities. \n
\n
The following items will update as you modify the file:\n
- Words: [${spaced_word}](command:vscode-hanzi-counter.highlight?%5B%22spaced_word%22%5D)\n
- Letters & Punctuations: [${letter + punct}](command:vscode-hanzi-counter.highlight?%5B${encodeURIComponent('[["letter"],[],["punct"],[],[],[],[]]')}%5D)\n
\n
You can click the number shown above to highlight relevant text in the document.\n
\n
Before starting to use, you need to [select the default tooltip template](command:workbench.action.openSettings?${encodeURIComponent('["vscode-hanzi-counter.template"]')}) to show in the tooltip.\n
\n
Change the default text \`overview\` in \`Tooltip Template Name\` to one item of the \`Items\` column of \`Templates\` setting.\n
Change \`StatusBar Template Name\` to \`status-bar\` for English display on status bar.\n
\n
${this.paging.generate('overview')}
`
