# python迭代器和生成器

###列表推导：
生成一个列表：`[0,2,4,6,8]`
```python
>>> [i for i in range(10) if i % 2 == 0]
[0,2,4,6,8]
```

###enumerate
```python
seq = ["one","two","three"]
for i,element in enumerate(seq):
    seq[i] = '%d:%s' % (i,seq[i])
```
上面的代码将生成下面的列表：
`['0:one','1:two','2:three']`

###迭代器：
```python
>>> i = iter('abc')
>>> i.next()
'a'
>>> i.next()
'b'
>>> i.next()
'c'
>>> i.next()
Traceback (most recent call last):
      File "<stdin>", line 1, in <module>
StopIteration
>>> 
```
遍历完毕将产生 StopIteration 异常

###生成器
```python
>>> def fibonacci():
...     a, b = 0, 1
...     while True:
...         yield b
...         a, b = b, a+b
... 
>>> fib = fibonacci()
>>> fib.next()
1
>>> fib.next()
1
>>> fib.next()
2
>>> [fib.next() for i in range(10)]
[3, 5, 8, 13, 21, 34, 55, 89, 144, 233]
>>>
```

###协同程序
协同不同于多线程，线程是抢占式的，下面的例子可以说明这点：
```python
#!/usr/bin/env python
#coding=utf-8
#协同
import multitask
from threading import Thread
import time

def conroutine_1():
    for i in range(3):
        print 'c1'
        yield i

def conroutine_2():
    for i in range(3):
        print 'c2'
        yield i

def conroutine_3():
    for i in range(3):
        print 'c3'

def conroutine_4():
    for i in range(3):
        print 'c4'

print "==========协同========"
multitask.add(conroutine_1())
multitask.add(conroutine_2())
multitask.run()

print "==========多线程========"
a = Thread(target=conroutine_3,args=())
b = Thread(target=conroutine_4,args=())
a.start()
b.start()
```
上面的程序运行的结果可能是这样的：
```
==========协同========
c1
c2
c1
c2
c1
c2
==========多线程========
c3
c3c4

c3
c4
c4
```
从结果来看，协同程序c1和c2依次执行，多线程的执行结果就不好说了，有多种可能

下面的程序是用生成器形成的echo服务器
```python
#!/usr/bin/env python
#coding=utf-8
from __future__ import with_statement
from contextlib import closing
import socket
import multitask
def client_handler(sock):
    with closing(socket):
        while True:
            data = (yield multitask.recv(sock,1024))
            if not data:
                break
            yield multitask.send(sock,data)

def echo_server(hostname,port):
    addrinfo = socket.getaddrinfo(hostname,port,
                                  socket.AF_UNSPEC,
                                  socket.SOCK_STREAM)
    (family,socktype,proto, canonname,sockaddr)=addrinfo[0]
    with closing(socket.socket(family,socktype,proto)) as sock:
        sock.setsockopt(socket.SOL_SOCKET,socket.SO_REUSEADDR,1)
        sock.bind(sockaddr)
        sock.listen(5)
        while True:
            multitask.add(client_handler((yield multitask.accept(sock))[0]))

if __name__=='__main__':
    hostname = 'localhost'
    port = 1111
    multitask.add(echo_server(hostname,port))
    try:
        multitask.run()
    except KeyboardInterrupt:
        pass
```
上面的代码理解起来有点难度，我也有些地方不太懂，测试的话可以用telnet,方法是：

`telnet localhost 1111`

然后再输入一些信息，回车以后会显示你发送的信息。

###itertools模块
#####islice：窗口迭代器
```python
#!/usr/bin/env python
#coding=utf-8
import itertools
def starting_at_five():
    value = raw_input("input1").strip()
    while value != '':
        for el in itertools.islice(value.split(),4,None):
            yield el
        value = raw_input("input2").strip()

iter = starting_at_five()
while True:
    print iter.next()
```
下面是一些测试输入输出：
```
input1: 1 2 3 4 5 6
5
6
input2: 1 2    
input2: 1 2 3 4 5 6 7 8
5
6
7
8
input2: 
```
从上面的例子可以看出，上面的代码是输出第4个之后的元素，利用这个功能我们可以输出特定位置的元素

#####tee
```python
#!/usr/bin/env python
#coding=utf-8
import itertools
def with_head(iterable,headsize=1):
    a, b = itertools.tee(iterable)
    print list(itertools.islice(a,headsize)),b
seq = [1]
with_head(seq)
seq = [1,2,3,4]
with_head(seq,4)
```
上面的代码我也没看懂，具体怎么用还需要进一步学习  
代码运行结果是：  
```
[1] <itertools.tee object at 0xb71f866c>
[1, 2, 3, 4] <itertools.tee object at 0xb71f862c>
```
#####uniq迭代器：
使用行程长度编码来压缩数据：将字符串中每组相邻的重复字符替换成字符本身的重复字数，没重复则为1,代码实现：
```python
#!/usr/bin/env python
#coding=utf-8
import itertools
def compress(data):
    return ((len(list(group)),name) 
            for name,group in itertools.groupby(data))

def decompress(data):
    return (car * size for size,car in data)

print list(compress('aaasdffffffffffffffffffffff'))
compressed = list(compress('aaasdffffffffffffffffffffff'))
print "".join(decompress(compressed))
```
运行结果：
```
[(3, 'a'), (1, 's'), (1, 'd'), (22, 'f')]
aaasdffffffffffffffffffffff
```
