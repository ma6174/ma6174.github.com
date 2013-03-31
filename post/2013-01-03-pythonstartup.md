# 给python交互式命令行增加自动补全和命令历史

用过zsh的同学肯定对其自动补全功能印象深刻，通过简单的定制python交互式命令行也能实现类似功能，具体操作如下：

1. 在用户目录下新建".pythonstartup"文件，写入以下内容：
```python
import readline
import rlcompleter
import atexit
import os
#tab completion
readline.parse_and_bind('tab: complete')
#history file
historyfile = os.path.join(os.environ['HOME'],'.pythonstartup')
try:
    readline.read_history_file(historyfile)
except:
    pass
atexit.register(readline.write_history_file,historyfile)
del os,historyfile,readline,rlcompleter
```

- 增加环境变量，编辑.bashrc或.zshrc文件（根据你的shell确定），加入以下内容：
```bash
export PYTHONSTARTUP="/home/ma6174/.pythonstartup"
```

- 从新打开终端，进入python交互式命令行界面试一下。下面是我的运行效果截图：
![pythonstartup](./images/pythonstartup.png)
