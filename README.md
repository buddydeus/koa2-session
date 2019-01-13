## koa2-session  
[![NPM version][npm-image]][npm-url]
  
  
## koa2-session是什么?

koa2-session是[koa@2.0.0](https://github.com/koajs/koa)的中间件，其依赖`redis`完成session存储。  
目前版本主要结构及代码沿用[koa-session2](https://github.com/Secbone/koa-session2)

## 安装与使用

- 安装
```bash
$ npm install koa2-session
```

- 使用
```node
let app = new koa();

app.use(require("koa2-compass")({
	mode:    "compress",
	project: path.join(__dirname),
	sass:    "./scss",
	css:     "./static/css"
}));
app.use(require("koa-static")(path.join(__dirname, "./static")));
```
  
  
## 感激
感谢以下的项目,排名不分先后
* [koa-session2](https://github.com/Secbone/koa-session2)
  
  
## License

  MIT

[npm-image]: https://img.shields.io/npm/v/koa2-session.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/koa2-session
