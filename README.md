# 多功能文档字数统计

多功能文档字数统计，支持中文、日文、朝鲜/韩文，支持选区统计，点击即可高亮，也可用正则表达式自定义要统计的内容。

中国語/日本語/朝鮮/韓国語文字数計算ツール。全体/選択範囲を文字数カウント。強調表示と正規表現(Regex)機能があります。

중국어/일본어/한국어/조선어 세기 도구. 전체/선택 범위를 문자 수 카운트. 강조 및 정규식(Regex) 함수가 있습니다.

Customizable word counter with great support of Chinese characters (Hanzi), Japanese and Korean. Supports count in selection. Supports highlighting. Use custom regexes to match any character type you want.

作者不会日语和(朝鲜语/韩语)，但是这些语言字数统计是准确的。更多细节见下方说明。\
The author hasn't learned Japanese or Korean language, but the character/word counters of those languages are correct. See below for more details. (You may want to use [google translate](https://translate.google.com/).)

## 特色功能

- 该扩展只在打开文件、保存文件时对全文统计字数。编辑过程中，扩展会只统计改变的部分，并动态更新统计结果。相比其他扩展每次修改都会重新全文统计，无论字数多少，该扩展只会占用极少的计算资源。约50万单词时，[VS Code 的示例词数统计扩展](https://marketplace.visualstudio.com/items?itemName=ms-vscode.wordcount)在编辑时出现明显卡顿（更改 markdown 判断代码使其在纯文本模式下启动，以消除markdown语法高亮的性能影响），本扩展依然能实时更新，没有可察觉的延迟。
- 可使用 Javascript 自定义状态栏上、悬浮提示中显示的内容；使用正则表达式自主添加统计规则。自主编写规则、更改格式，可以解决你个人统计字数的绝大部分需求。
- 可以为不同编程语言配置不同设置，或启用禁用显示。
- 有丰富的预设配置，方便不同国家、不同语言用户使用。将来还会编写配置教程和英文描述。
- 使用 `Intl.Segmenter` 划分字词，组合字符可以合起来统计，支持emoji

## 图片展示

![中文界面](images/screenshot-tooltip.png)
![English](images/screenshot-tooltip-english.png)
![高亮](images/screenshot-highlight.png)

## 功能

在状态栏上显示文档字数，鼠标移动到字数上，会显示详细统计信息。所有内容均可自定义。

点击对应项目的数字可以高亮匹配的文字，在右边的滚动条上也会标记出匹配文字所在的位置

该扩展使用正则表达式匹配各类文字，可以在设置中自定义。

状态栏显示默认在右边，也可以在设置里更改。

## (朝鲜语/韩语)字符(谚文)规则说明

(朝鲜语/韩语)使用谚文作为主要书写系统。Unicode中，谚文可以使用音节形式和组合形式两种方法表示：音节形式即一个谚文方块字(音节)对应一个字符；而组合形式中，一个谚文方块字可由若干个部件字符(包括初声、中声、终声几类字符)组成。

通过对不同类型字符区别对待，可以准确地统计出谚文文本方块字(音节)的个数。规则如下：

|字符类型|正则|描述|
|-|-|-|
|音节和兼容字符|`[\\u{ac00}-\\u{d7af}\\u{3130}-\\u{318f}\\u{ffa0}-\\u{ffdf}]`|包括所有 [Hangul Syllables](https://en.wikipedia.org/wiki/Hangul_Syllables)、[Hangul Compatibility Jamo](https://en.wikipedia.org/wiki/Hangul_Compatibility_Jamo) 中的字符，和 [Halfwidth and Fullwidth Forms](https://en.wikipedia.org/wiki/Halfwidth_and_Fullwidth_Forms_(Unicode_block)) 中的半角谚文字符|
|初声L|`[\\u{1100}-\\u{115f}\\u{a960}-\\u{a97f}]`|[Hangul Jamo](https://en.wikipedia.org/wiki/Hangul_Jamo_(Unicode_block)) 和 [Hangul Jamo Extended-A](https://en.wikipedia.org/wiki/Hangul_Jamo_Extended-A) 的所有L类字符|
|中声V|`[\\u{1160}-\\u{11a7}\\u{d7b0}-\\u{d7ca}]`|[Hangul Jamo](https://en.wikipedia.org/wiki/Hangul_Jamo_(Unicode_block)) 和 [Hangul Jamo Extended-B](https://en.wikipedia.org/wiki/Hangul_Jamo_Extended-B) 的所有V类字符|
|终声T|`[\\u{11a8}-\\u{11ff}\\u{d7cb}-\\u{d7ff}]`|[Hangul Jamo](https://en.wikipedia.org/wiki/Hangul_Jamo_(Unicode_block)) 和 [Hangul Jamo Extended-B](https://en.wikipedia.org/wiki/Hangul_Jamo_Extended-B) 的所有T类字符|

参考：\
<https://stackoverflow.com/questions/9928505/what-does-the-expression-x-match-when-inside-a-regex>\
<https://stackoverflow.com/questions/53198407/is-there-a-regular-expression-which-matches-a-single-grapheme-cluster>

- 音节和兼容字符算一个字
- L算一个字
- V前没有L，算一个字
- T前没有V，算一个字

合成後的正则表达式：

`[\\u{ac00}-\\u{d7af}\\u{3130}-\\u{318f}\\u{ffa0}-\\u{ffdf}]|[\\u{1100}-\\u{115f}\\u{a960}-\\u{a97f}]|(?<![\\u{1100}-\\u{115f}\\u{a960}-\\u{a97f}])[\\u{1160}-\\u{11a7}\\u{d7b0}-\\u{d7ca}]|(?<![\\u{1160}-\\u{11a7}\\u{d7b0}-\\u{d7ca}])[\\u{11a8}-\\u{11ff}\\u{d7cb}-\\u{d7ff}]`

## Grapheme cluster boundary 和 Word boundary 规则说明

Unicode grapheme cluster 是书写系统中[公认的「字符」](http://utf8everywhere.org/#characters)的[一种近似](https://unicode.org/reports/tr29/)。有组合符号的字符，虽然组合符号是多个 codepoints，但是整体是一个 grapheme cluster。

Unicode 网站上有提供 [grapheme cluster 和 word 的规则](https://unicode.org/reports/tr29/)，javascript 中自带有 [`Intl.Segmenter`] 用来将文本分隔为 grapheme cluster 和 word 的。该扩展利用了该API进行指定语言的分词分句，详情请参考配置编写教程（暂未编写，有空会做）。
