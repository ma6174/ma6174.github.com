# 前端学习笔记

### 标识符

- 可以使用`$`符号
- 使用驼峰大小写格式

### 变量

- 不加`var`则为全局变量
- `var`声明的但未初始化的变量值为`undefined`
- `null`表示一个空指针
- `undefined`是`null`派生的，两者相等

### NaN

- `NaN`与任何值不相等，包括NaN
- 判断时只能用isNaN()方法

### 字符串转换成数字方法

- Number()
    - `null`返回0
    - `undefined`返回`NaN`
    - 空字符串返回`0`
    - 不能转换的字符串返回`NaN`

- parseInt()，parseFloat()
    - 会尽力去转换，转换所有能转换的
    - 不能转换的字符串返回`NaN`

### 事件捕获

- 外层先捕获，依次往里面传递
- `addEventListener("click",outer,true);`

### 事件冒泡

- 内层先捕获，依次往外传
- `addEventListener("click",outer,false);`

### 阻止冒泡

1. `return false`
2. 用js阻止
```javascript
//阻止冒泡事件
 function stopBubble(e) {  
     if (e && e.stopPropagation) {//éIE  
         e.stopPropagation();  
     }  
     else {//IE  
         window.event.cancelBubble = true;  
     }  
 }  
 //阻止默认浏览器动作(W3C)  
 function stopDefault(e) {  
     if (e && e.preventDefault)  
         e.preventDefault();  
     //IE中阻止函数器默认动作的方式  
     else  
         window.event.returnValue = false;  
     return false;  
}   
```

### cookies

三个比较实用的函数

```javascript
function setCookie(name,value){
    var exp  = new Date();  
    exp.setTime(exp.getTime() + 30*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();

}
function getCookie(name){
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
    if(arr != null) return unescape(arr[2]); return null;

}
function delCookie(name){
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();

}
```

### jquery获取json数据

```javascript
var jqxhr = $.getJSON( "example.json", function() {
  console.log( "success" );
})
.done(function() { console.log( "second success" ); })
.fail(function() { console.log( "error" ); })
.always(function() { console.log( "complete" ); });
```

### 对json数据进行排序

```javascript
data.sort(function(a,b){
    //自定义排序方法
});
```

### jquery创建元素与追加元素

```javascript
var tr=$("<tr></tr>");
tr.appendTo($("#mytable"));
```

### 字符串

- 也是不可变的

### 一元加运算符

- 非数值加"+"时会和Number()一样转换
```javascript
var s1 = 1.1;
s1 = +s1; // 1.1

var s2 = "sdfds"
s2 = +s2; // NaN
```
### 数字

- `Infinity`表示无穷大

### 加法

 数字+字符串: 先将数字转换成字符串,然后拼接起来

```javascript
var a = 5 + "5"; // a = "55"
```

### 减法

如果一个运算符是字符串，布尔值，null或undefined，则用Number()转换成数值再计算

```javascript
var b = 5 - "2"; // b = 3
```

### 关系比较

- 两个都是字符串，按字母的字符编码排序
- 有一个是数字，把不数字的转换成数字再比较

```javascript
"Baaa" < "aaa"; // true
"23" < "3" ; // true
```

### 相等运算符

- 相等和不相等：先转换再比较
- 全等和不全等：仅比较不转换
- 一个字符串一个数值，将字符串转换成数值再计算

### 逗号操作符

- 用于赋值时取最后一项
```javascript
var num = (1,2,3,4); // num = 4
```

### for循环

- 循环内部变量可以在外部访问

### label

- 类似于C语言的goto语句
- break label
- continue label

### with

- 将代码的作用域放到一个特定的对象中

### 函数参数

- 个数无所谓，类型无所谓
- 所有参数构成一个数组
- 函数内部可以通过arguments来访问参数数组

### 函数没有重载

### 递归

- `arguments.callee`指一个正在执行的函数的指针，递归调用的时候防止函数被修改
