
# 字数统计示例和比较 Word count examples and comparison

[comment]: # (此文本应按 utf-8 编码存储。)

下文列出了几篇文本，有自然出现的文本，还有精心构造的文本。每篇文本後附带了各字数统计工具的统计结果，以便比较各统计工具的特点，判断统计的结果正确不正确。

因为示例主要是根据本扩展特性选取和构造的，所以可能结果比较偏向本扩展更好，但是也有不好的，使用者可以自行选择参考。

**使用工具的列表和版本**

|工具名|作者|版本|更新日期|语种(正代表正则)|链接|
|-|-|-|-|-|-|
|Multi-purpose Hanzi and Word Counter|geezmolycos|1.3.1|2023-03-08|中日韩西正|<https://marketplace.visualstudio.com/items?itemName=geezmolycos.vscode-hanzi-counter>|
|Word Count CJK|张鹏程|1.3.1|2019-04-07|中(日韩)西|<https://marketplace.visualstudio.com/items?itemName=holmescn.vscode-wordcount-cjk>|
|Word Count CJK|krysenlo|1.6.2|2020-11-03|中(日韩)西正|<https://marketplace.visualstudio.com/items?itemName=krysenlo.vscode-wordcount-cjk>|
|Japanese Word Count|sifue|0.0.2|2023-01-12|日西|<https://marketplace.visualstudio.com/items?itemName=sifue.japanese-word-count>|
|WordCounter|Etienne Faisant|2.4.3|2022-08-09|西|<https://marketplace.visualstudio.com/items?itemName=kirozen.wordcounter>|
|Microsoft Word|Microsoft|2019||中(日韩)西|<https://www.microsoft.com/en-us/microsoft-365/previous-versions/microsoft-office-2019>|
|LibreOffice Writer|The Document Foundation|7.4.4.1|2022-12-21|中(日韩)西|<https://www.libreoffice.org/>|
|wordcounter.net|||2023-03-09|西|<https://wordcounter.net/>|
|wordcount.com、wordcounttool.com|||2023-03-09|西|<https://wordcount.com/><https://www.wordcounttool.com/>|
|countwordsworth.com|||2023-03-09|西|<https://countwordsworth.com/>|
|eteste.com、91maths.com|||2023-03-09|中西|<https://www.eteste.com/><https://count.91maths.com/>|
|fuhaoku.net|||2023-03-09|中西|<https://www.fuhaoku.net/tool/zishutongji.html>|

## 语言测试-中日韩文本

**纯中文**

> 北冥有鱼，其名为鲲。鲲之大，不知其几千里也。化而为鸟，其名为鹏。鹏之背，不知其几千里也；怒而飞，其翼若垂天之云。是鸟也，海运则将徙于南冥。南冥者，天池也。齐谐者，志怪者也。谐之言曰：“鹏之徙于南冥也，水击三千里，抟扶摇而上者九万里，去以六月息者也。”野马也，尘埃也，生物之以息相吹也。天之苍苍，其正色邪？其远而无所至极邪？其视下也亦若是，则已矣。且夫水之积也不厚，则负大舟也无力。覆杯水于坳堂之上，则芥为之舟，置杯焉则胶，水浅而舟大也。风之积也不厚，则其负大翼也无力。故九万里则风斯在下矣，而后乃今培风；背负青天而莫之夭阏者，而后乃今将图南。蜩与学鸠笑之曰：“我决起而飞，枪榆、枋，时则不至而控于地而已矣，奚以之九万里而南为？”适莽苍者三湌而反，腹犹果然；适百里者宿舂粮；适千里者三月聚粮。之二虫又何知！小知不及大知，小年不及大年。奚以知其然也？朝菌不知晦朔，蟪蛄不知春秋，此小年也。楚之南有冥灵者，以五百岁为春，五百岁为秋；上古有大椿者，以八千岁为春，八千岁为秋。而彭祖乃今以久特闻，众人匹之，不亦悲乎！

(来自[ctext.org](https://ctext.org/))

**测试结果**

|工具名|字符数|非空白字符数|单词数|中文字数(含/不含标点)|西文字数|句数|段数|其他|
|-|-:|-:|-:|-:|-:|-:|-:|-|
|Multi-purpose Hanzi and Word Counter|453|453|1|453/382||24|||
|Word Count CJK|453|453|0|382|||||
|Japanese Word Count|453|453||||||原稿用紙換算(400x?枚): 2|
|WordCounter|453||1||||1|1Line, ~0m0s reading time|
|Microsoft Word|453|453|0|453|||1|行: 16|
|LibreOffice Writer|453|453|453|449|||||
|eteste.com|906|||382|0|||71个标点(全角)|
|fuhaoku.net|453||0|382/382+71|0||1||

---

**中日韩混合**

文本来源：Wikipedia 「蚕」词条的[韩](https://ko.wikipedia.org/wiki/%EB%88%84%EC%97%90%EB%82%98%EB%B0%A9)[日](https://ja.wikipedia.org/wiki/%E3%82%AB%E3%82%A4%E3%82%B3)[中](https://zh.wikipedia.org/wiki/%E8%9A%95)语言版本

> 누에나방(Bombyx mori)은 누에나방과의 나방이다. 누에나방의 애벌레는 누에라고 하고, 이를 한자로는 잠(蠶)이라고 한다. 하늘에서 내린 벌레라는 의미로 천충(天蟲)이라고 부르기도 한다.\
> カイコ（蚕、学名：Bombyx mori）はチョウ目（鱗翅目）カイコガ科に属する昆虫の一種。和名はカイコガとされる場合もカイコとされる場合もある。カイコガと呼ばれる場合も、幼虫はカイコと呼ばれることが多い。幼虫はクワ（桑）の葉を食べて育ち、糸を分泌して繭をつくりその中で蛹に変態する。この糸を人間が繊維素材として利用したものが絹である。\
> 家蚕（学名：Bombyx mori）是鳞翅目蚕蛾科家蚕蛾属的完全变态昆虫，为丝绸的主要原料来源，在人类经济生活及文化历史上占有重要地位。家蚕原产中国，其幼虫在华南地区俗称蚕宝宝或娘仔，成虫称为蚕蛾。

|工具名|字符数|单词数|中文字数(含/不含标点)|假名字数|谚文字数|西文字数|句数|段数|其他|
|-|-:|-:|-:|-:|-:|-:|-:|-:|-|
|Multi-purpose Hanzi and Word Counter|376/354|23|166/132|92(66/26)|100/66||10|||
|Word Count CJK|376/354|6|132||||10|||
|Japanese Word Count|374/354||||||||原稿用紙換算(400x?枚): 1|
|WordCounter|376|23||||||1|3Lines, ~0m7s reading time|
|Microsoft Word|374/354|14|(314)|(314)|(314)|||3|行: 13|
|LibreOffice Writer|374/354|328|(314)|(314)|(314)|||||
|eteste.com|690||132|||62|||182个标点(全角)|
|fuhaoku.net|374|6|132/132+182|||30||3||

**谚文 NFC 和 NFD 形式**

谚文在 Unicode 中，有两种标准化表示形式（非标准化的形式可以多于两种）。两种形式可以互相转换。如下：

|文本|形式|Unicode 序列|
|-|-|-|
|한|Normalization Form C (NFC)|U+D55C`한`|
|한|Normalization Form D (NFD)|U+1112`ᄒ`; U+1161`ᅡ`; U+11AB`ᆫ`|

可见，NFC 标准形式是由一个字符(codepoint)表示一个音节（方块字），而 NFD 标准形式是由多个部件字符(codepoint)组合成一个字符。因为这个特性，许多字数统计的工具未考虑 NFD 标准形式和其他形式，统计的时候会把显示出的一个字符统计成很多个。两种形式可以通过尝试用 Backspace 键删除的方式区分。

测试文本如下：

> 누에나방

|文本|形式|Unicode 序列|
|-|-|-|
|누|NFC|U+B204`누`|
|에|NFD|U+110B`ᄋ`; U+1166`ᅦ`|
|나|NFD|U+1102`ᄂ`; U+1161`ᅡ`|
|방|非标准|U+BC14`바`; U+11BC`ᆼ`|

**测试结果**

|工具名|字符数|其他|
|-|-|-|
|Multi-purpose Hanzi and Word Counter|4||
|Word Count CJK|7||
|Japanese Word Count|4||
|WordCounter|7||
|Microsoft Word|7|不能正常显示组合字符，部件显示成单独字符|
|LibreOffice Writer|Characters including space: 4; excluding: 7||
|eteste.com|14个字符，7个标点（全角）||
|fuhaoku.net|字符总数： 7 个；字符总数： 7 个||

**兼容字符和未使用字符**

有一些字符是 Unicode 为了兼容其他编码收入其中的，例如 [Kangxi Radicals](https://en.wikipedia.org/wiki/Kangxi_Radicals_(Unicode_block))。这些字符和已有的汉字等字符字形重复。还有一些字符，其所处 Block 不是 CJK 统一表意文字，但是是汉字，例如`〇`字处在 [CJK Symbols and Punctuation](https://en.wikipedia.org/wiki/CJK_Symbols_and_Punctuation) 中，但是[实际上算汉字](https://www.zhihu.com/question/21635454)。CJK 统一表意文字块内还有一些後来分配的码位。这些字符对实现得不好的字数统计工具是一种考验，会造成统计出错。

测试文本2中包含非 BMP [平面](https://en.wikipedia.org/wiki/Plane_(Unicode))中的汉字。

测试文本1：
> 〇〸〹⿏⿏⽜⾺猪喝泥㌀㍘㎪🈚

`〇〸〹`是 CJK 符号与标点中的数字汉字，`⿏⿏⽜⾺`是康熙部首，`猪喝泥`是 CJK COMPATIBILITY IDEOGRAPH

测试文本2(CJKUI 及 Extension 各区字符):
> 龦鿿㐀𠀀𪜀𫝀𫠠𬺰𰀀𱍐

`龦鿿`是 CJKUI 中後来分配的码位，`㐀𠀀𪜀𫝀𫠠𬺰𰀀𱍐`分别为 ExtA~H 的字符

|工具名|属于汉字的字|其他|
|-|-|-|
|Multi-purpose Hanzi and Word Counter|猪喝泥;龦鿿㐀𠀀𪜀𫝀𫠠𬺰𰀀|ExtA~G(未来1.3.2版本会将〇和苏州码子判定为汉字)|
|Word Count CJK|猪泥|不包括任何Ext|
|Microsoft Word|〇〸〹⿏⿏⽜⾺猪喝泥㌀㍘㎪;龦㐀𠀀𪜀𫝀𫠠𬺰𰀀𱍐|ExtA~H|
|LibreOffice Writer|〇〸〹⿏⿏⽜⾺猪喝泥㌀㍘㎪;龦鿿㐀𠀀𪜀𫝀𫠠𬺰𰀀|ExtA~G|
|eteste.com|(无)|均视为标点|
|fuhaoku.net|(无)|均视为标点|

## 语言测试-西文文本

**英文文本**
> Call me Ishmael. Some years ago⁠—never mind how long precisely⁠—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off⁠—then, I account it high time to get to sea as soon as I can.

|工具名|总/非空白字符数|字母/标点符号|单词数|句数|其他|
|-|-:|-:|-:|-:|-|
|Multi-purpose Hanzi and Word Counter|798/657|636/18|142/146/145|4|单词数分别为「空格分词」「基本词」和「分段分词」|
|Word Count CJK|798/657||146|||
|WordCounter|798||142||1 Line, 1 Paragraph, ~0m43s reading time|
|Microsoft Word|798/657||146||字数: 147; 段落数: 1; 行: 14|
|LibreOffice Writer|798/657||148|
|wordcounter.net|798||142||
|wordcount.com|798/657||142|4|1 Paragraph; 222 Syllables
|countwordsworth.com|657|636/|142|4|有丰富的其他英语相关的信息|

**国际音标**

以下是 NFD 标准形式
> qú lì qwək qaˤ ʂaŋ sí jɨ́ kʰɨ́j ʔin ʁwá puq bìe tsʰjuo tɕɨ

|工具名|总/非空白字符数|字母/标点符号|单词数|句数|其他|
|-|-:|-:|-:|-:|-|
|Multi-purpose Hanzi and Word Counter|56/50|43/0|14/16/14|1|单词数分别为「空格分词」「基本词」和「分段分词」|
|Word Count CJK|63/50||18|||
|WordCounter|63||14||1 Line, 1 Paragraph, ~0m4s reading time|
|Microsoft Word|63/50||17||字数: 31; 段落数: 1; 行: 1|
|LibreOffice Writer|56/43||14|
|wordcounter.net|63||14||
|wordcount.com|63/50||14|1|1 Paragraph; 17 Syllables
|countwordsworth.com|50|40/|14|1|有丰富的其他英语相关的信息|

以下是 NFC 标准形式
> qú lì qwək qaˤ ʂaŋ sí jɨ́ kʰɨ́j ʔin ʁwá puq bìe tsʰjuo tɕɨ

|工具名|总/非空白字符数|字母/标点符号|单词数|句数|其他|
|-|-:|-:|-:|-:|-|
|Multi-purpose Hanzi and Word Counter|56/45|43/0|14/15/14|1|单词数分别为「空格分词」「基本词」和「分段分词」|
|Word Count CJK|58/45||18|||
|WordCounter|58||14||1 Line, 1 Paragraph, ~0m4s reading time|
|Microsoft Word|58/45||18||字数: 37; 段落数: 1; 行: 1|
|LibreOffice Writer|56/43||14|
|wordcounter.net|58||14||
|wordcount.com|58/45||14|1|1 Paragraph; 16 Syllables
|countwordsworth.com|45|40/|14|1|有丰富的其他英语相关的信息|

## 语言测试-unicode

**非 BMP 字符和 emoji**

非 BMP 字符指 Unicode 中不属于 [Basic Multilingual Plane](https://en.wikipedia.org/wiki/Plane_(Unicode)#Basic_Multilingual_Plane) 的字符。因为历史原因，UTF-16 编码中（JavaScript字符串使用 UTF-16 编码）这些字符使用一对 Surrogate pair 表示，有些实现可能会将其当作两个字符。其次，一部分 emoji 字符是非 BMP 字符，而且一些 emoji 是由多个字符组合成的字符，例如：

|文本|Unicode 序列|
|-|-|
|👴🏻|U+1F474`👴`; U+1F3FB`🏻`|
|🇦🇶|U+1F1E6`🇦`; U+1F1F6`🇶`|
|👨‍👩‍👧‍👧|U+1F468`👨`; U+200D`‍`; U+1F469`👩`; U+200D`‍`; U+1F467`👧`; U+200D`‍`; U+1F467`👧`|

测试文本:
> 🐴👴🏻🇦🇶👨‍👩‍👧‍👧

- 结果为4个字符，说明使用了正确的分段算法，且正确处理 UTF-16
- 结果为12个字符，说明能正确处理 UTF-16 surrogate pair
- 结果为21字符，说明直接将 UTF-16 长度当作字符串长度了

|工具名|字符数|其他|
|-|-:|-|
|Multi-purpose Hanzi and Word Counter|4||
|Word Count CJK|21||
|Japanese Word Count|4||
|WordCounter|21|1 Word|
|Microsoft Word|12|1 个字|
|LibreOffice Writer|4|7 words, 4 characters|
|wordcounter.net|21|1 word 21 characters|
|wordcount.com|21|0 words 21 characters|
|countwordsworth.com|21|1 words; 21 characters|

## 性能对比

该扩展只在打开文件、保存文件时对全文统计字数。统计的结果按行缓存。编辑过程中，扩展会只统计改变的部分，并动态更新统计结果。无论字数多少，该扩展只会占用极少的计算资源，而其他扩展字数越多，性能就越差，占用 CPU 也会越多。

性能测试方法如下：

- 禁用其他字数统计扩展，启用待测试的字数统计扩展
- 启动 Extension Host Profile
- 打开待测文件
  - 重复100次：
    - 在文件最后输入`\naa bb`(`\n`代表换行符)
  - 将输入内容全部删除
- 保存文件，关闭文件
- 停止 Extension Host Profile，保存 profile 结果
- 在 profile 结果中查找总时间最长的扩展内函数。

|扩展名称|moby-dick-1k|moby-dick-10k|moby-dick-100k|moby-dick-1000k
|-|-:|-:|-:|-:|
|Multi-purpose Hanzi and Word Counter|79.41ms|106.30ms|273.72ms|2,051.07ms|
|Word Count CJK|86.64ms|454.77ms|3,877.94ms|38,058.62ms|
|Japanese Word Count|2,562.11ms|假死|崩溃|崩溃|
|WordCounter|54.18ms|187.56ms|1,280.74ms|12,288.55ms|

