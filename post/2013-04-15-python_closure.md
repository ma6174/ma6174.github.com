# python中的闭包

### 什么是闭包?

简单说,闭包就是根据不同的配置信息得到不同的结果

再来看看专业的解释:闭包（Closure）是词法闭包（Lexical Closure）的简称，是引用了自由变量的函数。这个被引用的自由变量将和这个函数一同存在，即使已经离开了创造它的环境也不例外。所以，有另一种说法认为闭包是由函数和与其相关的引用环境组合而成的实体。

### python实例

看概念总是让人摸不着头脑,看几个python小例子就会了

### 例1

```python
def make_adder(addend):
    def adder(augend):
        return augend + addend
    return adder

p = make_adder(23)
q = make_adder(44)

print p(100)
print q(100)
```

##### 运行结果:

```
123
144
```

##### 分析一下:

我们发现,`make_adder`是一个函数,包括一个参数`addend`,比较特殊的地方是这个函数里面又定义了一个新函数,这个新函数里面的一个变量正好是外部`make_adder`的参数.也就是说,外部传递过来的`addend`参数已经和`adder`函数绑定到一起了,形成了一个新函数,我们可以把`addend`看做新函数的一个配置信息,配置信息不同,函数的功能就不一样了,也就是能得到定制之后的函数.

再看看运行结果,我们发现,虽然p和q都是`make_adder`生成的,但是因为配置参数不同,后面再执行相同参数的函数后得到了不同的结果.这就是闭包.

### 例2

```
def hellocounter (name):
    count=[0] 
    def counter():
        count[0]+=1
        print 'Hello,',name,',',str(count[0])+' access!'
    return counter

hello = hellocounter('ma6174')
hello()
hello()
hello()  
```

##### 执行结果

```
Hello, ysisl , 1 access!
Hello, ysisl , 2 access!
Hello, ysisl , 3 access!
```

##### 分析一下

这个程序比较有趣,我们可以把这个程序看做统计一个函数调用次数的函数.`count[0]`可以看做一个计数器,没执行一次`hello`函数,`count[0]`的值就加1。也许你会有疑问:为什么不直接写`count`而用一个列表?这是python2的一个bug,如果不用列表的话,会报这样一个错误:

`UnboundLocalError: local variable 'count' referenced before assignment`.

什么意思?就是说`conut`这个变量你没有定义就直接引用了,我不知道这是个什么东西,程序就崩溃了.于是,再python3里面,引入了一个关键字:`nonlocal`,这个关键字是干什么的?就是告诉python程序,我的这个`count`变量是再外部定义的,你去外面找吧.然后python就去外层函数找,然后就找到了`count=0`这个定义和赋值,程序就能正常执行了.

`python3 代码`

```python
def hellocounter (name):
    count=0 
    def counter():
        nonlocal count
        count+=1
        print 'Hello,',name,',',str(count[0])+' access!'
    return counter

hello = hellocounter('ma6174')
hello()
hello()
hello()  
```

关于这个问题的研究您可以参考[http://linluxiang.iteye.com/blog/789946](这篇文章)

### 例3

```python
def makebold(fn):
    def wrapped():
        return "<b>" + fn() + "</b>"
    return wrapped

def makeitalic(fn):
    def wrapped():
        return "<i>" + fn() + "</i>"
    return wrapped

@makebold
@makeitalic
def hello():
    return "hello world"

print hello() 
```

##### 执行结果

```
<b><i>hello world</i></b>
```
### 简单分析

怎么样?这个程序熟悉吗?这不是传说的的装饰器吗?对,这就是装饰器,其实,装饰器就是一种闭包,我们再回想一下装饰器的概念:对函数(参数,返回值等)进行加工处理,生成一个功能增强版的一个函数。再看看闭包的概念,这个增强版的函数不就是我们配置之后的函数吗?区别在于,装饰器的参数是一个函数或类,专门对类或函数进行加工处理。

python里面的好多高级功能，比如装饰器，生成器，列表推到，闭包，匿名函数等，开发中用一下，可能会达到事半功倍的效果！
