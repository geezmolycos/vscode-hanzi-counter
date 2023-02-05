# Change Log

All notable changes to the "vscode-hanzi-counter" extension will be documented in this file.

## [Unreleased]

- 缩减中文标点符号范围，缩减到Script_extensions为Han或Common，且分类为P、S、N的字符
- 增加启用禁用、调节状态栏显示的设置

## [0.1.0] - 2023-02-05

- 在状态栏上显示文档字数，tooltip 中显示详细信息，点击展开显示更详细信息
- 在设置中添加要统计字数的各类项目对应的正则表达式
- 在设置中通过 Javascript 函数自定义要显示的内容
- 默认设置添加统计项目：
  - 单词数
  - 总字符数
  - 非 ASCII 字符数
  - 中文字数（含标点和不含标点）
  - UTF-8 大小
