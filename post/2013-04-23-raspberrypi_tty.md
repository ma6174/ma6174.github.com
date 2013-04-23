# 通过串口连接控制树莓派

### 需求

在没有网络，没用键盘，没有显示器的情况下，控制树莓派就成了一个问题。
今天偶然看到一篇文章，说可以直接通过串口对树莓派进行控制。
果断一试，效果不错，果断分享！`^_^`

### 准备

- 树莓派开发板（已经刷好官方系统）
- USB转串口工具（PL2303）
- 杜邦线（4根）

### 连线

```
PL2303   树莓派
--------------------
VCC      +5V
RX       RXD(GPIO14)
TX       TXD(GPIO15)
GND      Ground
```

树莓派引脚分布图：

![images/gpios.png](images/gpios.png)

实物连线图

![images/lianxian.jpg](images/lianxian.jpg)

我是直接用笔记本的电源进行供电的，当然你也可以再外加一个电源。

### 安装软件

##### ubuntu linux

- 安装`ckermit`:`sudo apt-get install ckermit`
- 编辑配置文件：`vi ~/.kermrc`，写入以下内容：

```
set line /dev/ttyUSB0
set speed 115200
set carrier-watch off
set handshake none
set flow-control none
robust
set file type bin
set file name lit
set rec pack 1000
set send pack 1000
set windows 5
```

##### windows

windows下可以使用超级终端或者putty，选择一个com口，
然后设置波特率115200，就能连接了。

### 开始连接

- 将`PL2303`插入电脑USB，启动树莓派
- `sudo kermit`打开kermit
- 输入`c`，敲回车，这时应该看到树莓派启动时的一些输出信息
- 启动完毕，输入用户名和密码就能控制树莓派了

### 如何断开连接

- 输入快捷键：`CTRL  \ `，然后再按`c`，可以退出到kermit界面
- 再次输入`c`可以连接到树莓派
- 输入`exit`可以退出kermit

### 感受

使用串口进行连接确实方便很多，毕竟很多时候我们并不需要或者没有显示器，
仅仅控制树莓派的话这样就足够了。
