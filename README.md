# mbind
微型双向绑定库
为了可以在嵌入式设备提供的web页面实现简易双向绑定效果所写

支持 文本输入双向绑定 列表数据绑定

# 使用方法

## 1.引入文件

```
<script src="mbind.js"></script>
```

## 2.编写模板

```
<a @bind="time">
    ${time}
</a>
<div @foreach="v,list">
    <a>${v}</a><br>
</div>
```

## 3.挂载节点

```
data = mbind({
            time: "loading...",
            list: [1, 2, 3],
            text: "Hello world!"
        }, document.body)
```

# 接口说明

## 1.api

    function mbind(data,element)

data: Object //数据定义以及初始值
element： element //HTML DOM 节点

## 2.模板语法

    <tag @bind="变量名">...</tag>

当tag为input或textarea时，其为双向绑定,更新节点对象value值
当tag为其他时，变量更新会引起...中内容更新，支持js模板字符串

    <tag @foreach="迭代变量名,列表变量名">...</tag>

该语法会将...内容复制n（列表变量长度）次同时用迭代变量名编译模板
模板语法同js模板字符串