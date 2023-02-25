# 多功能文档字数统计

多功能文档字数统计，支持中文，支持选区中统计字数，也可用正则表达式自定义要统计的内容。

与其他同类扩展不同的地方在于：

- 该扩展只在打开文件、保存文件时对全文统计字数。编辑过程中，扩展会只统计改变的部分，并动态更新统计结果。相比其他扩展每次修改都会重新全文统计，无论字数多少，该扩展只会占用极少的计算资源。约50万单词时，[VS Code 的示例词数统计扩展](https://marketplace.visualstudio.com/items?itemName=ms-vscode.wordcount)在编辑时出现明显卡顿（更改 markdown 判断代码使其在纯文本模式下启动，以消除markdown语法高亮的性能影响），本扩展依然能实时更新，没有可察觉的延迟。
- 可使用 Javascript 自定义状态栏上、悬浮提示中显示的内容；使用正则表达式自主添加统计规则。自主编写规则、更改格式，可以解决你个人统计字数的绝大部分需求。
- 可以为不同编程语言配置不同设置，或启用禁用显示。
- 过段时间还会更新更多的预设配置，方便不同国家、不同语言用户使用。还会编写配置教程和中英文描述。

## 功能

在状态栏上显示文档字数，鼠标移动到字数上，会显示详细统计信息。所有内容均可自定义，默认设置包括以下内容：

- 单词数
- 非 ASCII 字符数
- 中文字数
- 中文字数（含标点）
- UTF-8 大小
- 非空白字符数
- 总字符数

点击对应项目的数字可以高亮匹配的文字，在右边的滚动条上也会标记出匹配文字所在的位置

该扩展使用正则表达式匹配各类文字，可以在设置中自定义。

状态栏显示默认在右边，也可以在设置里更改。

## (朝鲜语/韩语)字符(谚文)规则说明

(朝鲜语/韩语)使用谚文作为主要书写系统。Unicode中，谚文可以使用音节形式和组合形式两种方法表示：音节形式即一个谚文方块字(音节)对应一个字符；而组合形式中，一个谚文方块字可由若干个部件字符(包括初声、中声、终声几类字符)组成。

通过对不同类型字符区别对待，可以准确地统计出谚文文本方块字(音节)的个数。规则如下：

|字符类型|正则|描述|
|-|-|-|
|音节和兼容字符|`[\\u{ac00}-\\u{d7af}\\u{3130}-\\u{318f}\\u{ffa0}-\\u{ffdf}]`|包括所有 Hangul Syllables、Hangul Compatibility Jamo中的字符，和Halfwidth and Fullwidth Forms中的半角谚文字符|
|初声L|`[\\u{1100}-\\u{115f}\\u{a960}-\\u{a97f}]`|Hangul Jamo 和 Hangul Jamo Extended-A 的所有L类字符|
|中声V|`[\\u{1160}-\\u{11a7}\\u{d7b0}-\\u{d7ca}]`|Hangul Jamo 和 Hangul Jamo Extended-B 的所有V类字符|
|终声T|`[\\u{11a8}-\\u{11ff}\\u{d7cb}-\\u{d7ff}]`|Hangul Jamo 和 Hangul Jamo Extended-B 的所有T类字符|

- 音节和兼容字符算一个字
- L算一个字
- V前没有L，算一个字
- T前没有V，算一个字

合成後的正则表达式：

`[\\u{ac00}-\\u{d7af}\\u{3130}-\\u{318f}\\u{ffa0}-\\u{ffdf}]|[\\u{1100}-\\u{115f}\\u{a960}-\\u{a97f}]|(?<![\\u{1100}-\\u{115f}\\u{a960}-\\u{a97f}])[\\u{1160}-\\u{11a7}\\u{d7b0}-\\u{d7ca}]|(?<![\\u{1160}-\\u{11a7}\\u{d7b0}-\\u{d7ca}])[\\u{11a8}-\\u{11ff}\\u{d7cb}-\\u{d7ff}]`

