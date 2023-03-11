# 多功能文档字数统计

多功能文档字数统计，支持中文、日文、朝鲜/韩文，支持选区统计，点击即可高亮，也可用正则表达式自定义要统计的内容。

中国語/日本語/朝鮮/韓国語文字数計算ツール。全体/選択範囲を文字数カウント。強調表示と正規表現(Regex)機能があります。

중국어/일본어/한국어/조선어 세기 도구. 전체/선택 범위를 문자 수 카운트. 강조 및 정규식(Regex) 함수가 있습니다.

Customizable word counter with great support of Chinese characters (Hanzi), Japanese and Korean. Supports count in selection. Supports highlighting. Use custom regexes to match any character type you want.

## 功能简介

刚安装扩展时，状态栏的右下角会出现一个铅笔的图标，显示字数，鼠标移动到上面会弹出一个使用教程的提示，请按照提示更改设置。

在状态栏上显示文档字数，鼠标移动到字数上，会显示详细统计信息。所有内容均可自定义。

点击对应项目的数字可以高亮匹配的文字，在右边的滚动条上也会标记出匹配文字所在的位置

该扩展使用正则表达式匹配各类文字，可以在设置中自定义。

状态栏显示默认在右边，也可以在设置里更改。

## 对比其他扩展

**不卡顿，性能好**

统计结果按行缓存，不会因为字数很多就变卡顿。以下是与其他扩展的速度对比([详情](comparison.md#性能对比))。

[<img alt="speed-comparison.png" src="images/speed-comparison.png" width="400px" />](comparison.md#性能对比)

**支持多语言，中日韩**

默认配置有英简繁日韩，内容符合对应语言用户所需

<img alt="中文界面" src="images/screenshot-tooltip.png" width="200px" />
<img alt="English" src="images/screenshot-tooltip-english.png" width="200px" />

**结果正确，符合直觉**

正确地统计字数做起来比听起来难。本扩展使用 Unicode 属性决定字符属于哪类；使用现代 Javascript 分词 API `Intl.Segmenter` 处理组合字和组合符号。对各国文字、emoji 兼容性都极佳！

作者不会日语和(朝鲜语/韩语)，但是这些语言字数统计是准确的。（[详情](comparison.md)）

**点击即可高亮**

无论如何也找不到文档中的某个非 ASCII 字符在哪？只需点一下，就可以把它高亮出来。也是方便的文字类型可视化工具。

<img alt="highlight" src="images/screenshot-highlight.png" width="400px" />

**可自行魔改**

作者「金毛」认为每个工具都应该留下足够大的魔改空间，总有一些深度用户有极强的改造力和控制力。因此，本扩展可以自行添加正则表达式匹配你想要的几乎任何东西，并用 Javascript 函数模板控制显示内容！([配置教程](config-guide.md))
