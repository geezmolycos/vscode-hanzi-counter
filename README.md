# 多功能文档字数统计

多功能文档字数统计，支持中文，也可用正则表达式自定义要统计的内容。

## 功能

在状态栏上显示文档字数，鼠标移动到字数上，会显示详细统计信息。所有内容均可自定义，默认设置包括以下内容：

- 单词数（英文等语言）
- 总字符数
- 非 ASCII 字符数
- 中文字数（含标点、不含标点）
- UTF-8 文件大小

该扩展使用正则表达式匹配各类文字，可以在设置中自定义。

## 设置

- `vscode-hanzi-counter.counterRegex`: 匹配要统计的各类文字（或单词）的正则表达式
- `vscode-hanzi-counter.statusBarTemplate`: Javascript 箭头函数，接受`vscode-hanzi-counter.counterRegex`的键为参数，返回状态栏上要显示的文本
- `vscode-hanzi-counter.tooltipTemplate`: 同上，但返回弹出提示的文本
- `vscode-hanzi-counter.clickedTooltipTemplate`: 同上，但返回展开后详细提示的文本
