---
title: 安装Arduino并添加ESP8266(NodeMCU)
date: 2023-07-11 20:18:57
tags:
---
> 本文将会介绍如何安装Arduino IDE，以及添加ESP8266(NodeMCU)开发板

::: show-site-info
arduino
:::

::: show-site-info
github
:::

## 1.安装Arduino IDE，打开下载地址，选取你使用的平台最新的版本
![下载选项](/images/1.PNG)

  这里要注意，Arduino IDE 分为1.x 和 2.x 两种版本，由于我要在VSCode 中进行Arduino项目开发，而VSCode Arduino插件目前只支持1.x版本 Arudino IDE，所以我选择了1.8 这个版本

## 2. 添加ESP8266
  安装好Arduino IDE 之后，打开Arduino IDE，依次点击 文件->首选项

  在图中标注位置添加ESP8266 Arduino的项目索引地址https://arduino.esp8266.com/stable/package_esp8266com_index.json

  添加成功之后，依次点击工具->开发板->开发板管理器 打开开发板管理器，搜索ESP8266并安装，安装好之后在工具->开发板中选择对应的ESP8266型号就可以了，这里我选择NodeMCU 1.0

## 3. 在VSCode中配置Arudino
如果你只是想用Arduino IDE自带的文本编辑器进行开发的话，这里就可以结束了，不过Arduino IDE的功能非常单一，没有任何的代码提示功能，所以我选择在VSCode中进行开发

a. 首先在VSCode中安装Arduino插件

安装好之后首先要配置Arduino的目录，要不然VSCode会提示找不到调试器

打开Arudino插件配置页面

填写Arduino的目录，windows通常在C:\Program Files (x86)\Arduino 这个目录下，然后保存重启VSCode

到这里就结束了，创建一个.ino的Arduino文件就可以在VSCode中进行开发了，如果你打开一个.ino文件，会发现在VSCode下面那一栏中出现了选择开发板的按钮选择你所使用的开发板就可以了，如果你打开一个示例的.ino文件会发现可能引入头文件那里会标红，至于怎么在VSCode中添加C++库的头文件，后面会介绍


