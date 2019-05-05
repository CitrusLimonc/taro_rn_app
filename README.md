# taro_rn_app 简易教程

## Taro RN端架构

[![Taro RN端架构](http://assets.processon.com/chart_image/5c988481e4b01e76978bd6ab.png)](http://assets.processon.com/chart_image/5c988481e4b01e76978bd6ab.png)

## Taro 安装及使用

[Taro 安装及使用](https://nervjs.github.io/taro/docs/GETTING-STARTED.html)

## 项目架构
```
.rn_temp //编译后的代码及应用文件在根目录的 .rn_temp 目录下
├── app.js
├── app.json
├── app_styles.js
├── index.html
├── index.js
├── package-lock.json
├── package.json
├── pages
│   └── index
│       ├── component.js
│       ├── index.js
│       └── index_styles.js
├── tmp
│   ├── assets
│   ├── index.bundle
│   └── index.bundle.meta
└── yarn.lock

```

## Run

``` shell
#安装依赖
cd taro_rn_app
yarn
cnpm i
npm i
# 打开 RN 编译预览模式
yarn dev:rn
```

像这样 ⬇️⬇️⬇️

[![2019-05-05%2015.01.26.png](https://raw.githubusercontent.com/itsonglei/taro_rn_app/master/img/2019-05-05%2015.01.26.png)](https://raw.githubusercontent.com/itsonglei/taro_rn_app/master/img/2019-05-05%2015.01.26.png)

这一趴做完了，新开一个终端

```shell
#Taro 编译文件
taro build --type rn --watch
```

像这样 ⬇️⬇️⬇️
[![2019-05-05%2015.37.31.png](https://raw.githubusercontent.com/itsonglei/taro_rn_app/master/img/2019-05-05%2015.37.31.png)](https://raw.githubusercontent.com/itsonglei/taro_rn_app/master/img/2019-05-05%2015.37.31.png)
taro 会自动开启一个终端，用来监听文件改动
[![2019-05-05%2015.37.41.png](https://raw.githubusercontent.com/itsonglei/taro_rn_app/master/img/2019-05-05%2015.37.41.png)](https://raw.githubusercontent.com/itsonglei/taro_rn_app/master/img/2019-05-05%2015.37.41.png)

然后进行 jsbundle 编译打包

[IOS jsbundle 编译打包](http://127.0.0.1:8081/index.bundle?platform=ios&dev=true)

[Android jsbundle 编译打包](http://127.0.0.1:8081/index.bundle?platform=android&dev=true)

