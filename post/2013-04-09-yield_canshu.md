# yield生成器函数的一点总结

生成器有主要有四种方法：

- `next()` 执行函数，直到遇到下一个yield为止，并返回值
- `send(value)` 为生成器发送一个数值，next()方法就相当于send(None)
- `close()` 终止生成器
- `throw(exc[exc_value,[exc_tb]])` 在生成器yield处引发一个异常，close()相当于引发一个GeneratorExit异常

### 输出型

一个斐波那契数列的例子

```python
def fibonacci():
     a, b = 0, 1
     while True:
         yield b
         a, b = b, a+b
a = fibonacci()
for i in range(10):
    print a.next()
```

运行结果：

```bash
1
1
2
3
5
8
13
21
34
55
python2.7 fb.py  0.01s user 0.01s system 94% cpu 0.025 total
```

生成器每次生成一个数字并返回。

### 接收输入型

```python
def reciver():
    while True:
        n = (yield)
        print "Got %s" % n

r = reciver()
r.next()
r.send(1)
r.send('2')
```

运行结果：

```bash
Got 1
Got 2
python2.7 rec.py  0.01s user 0.01s system 86% cpu 0.023 total
```

这个模型可以看做接收外部数据并进行处理。

### 输入输出型

生成器能否接收send传送来的数据，处理之后再返回呢？答案是肯定的

```python
def get():
    n = 0
    result = None
    while True:
        n = (yield result)
        result = n*10

t = get()
t.next()
for i in range(10):
    print t.send(str(i))
t.close()
```

运行结果

```bash
0000000000
1111111111
2222222222
3333333333
4444444444
5555555555
6666666666
7777777777
8888888888
9999999999
python2.7 problem.py  0.02s user 0.00s system 83% cpu 0.024 total
```

### 传递参数

当然生成器函数也是函数，也支持参数传递。

```python
def countdown(n):
    print("counting down from %d" % n)
    while n > 0:
        yield n
        n -= 1
    return 

c = countdown(10)
print c.next()
print c.next()

for i in countdown(10):
    print i

print sum(countdown(10))
```

运行结果

```bash
counting down from 10
10
9
counting down from 10
10
9
8
7
6
5
4
3
2
1
counting down from 10
55
```

从上面的例子我们发现，每次调用生成器函数要先执行`next()`函数，然后才能发送数据，
如果忘记的话就会报错。

```
TypeError: can't send non-None value to a just-started generator
```

这个有人容易忘记。这怎么办？用装饰器来自动执行：

```python
def coroutine(func):
    def start(*args,**kwargs):
        g = func(*args,**kwargs)
        g.next()
        return g
    return start

@coroutine
def reciver():
    while True:
        n = (yield)
        print "Got %s" % n

r = reciver()
r.send(1)
r.send('2')
```

下篇将介绍一些yield生成器的具体应用。
