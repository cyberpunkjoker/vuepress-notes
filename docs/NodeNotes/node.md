## 基本概念
:::tip
1. 模块系统
Node.js 模块系统使用 CommonJS 规范，可将代码分解为可重用的模块，并使用 require() 函数来加载它们。

2. 事件循环


3. 流控制
- **什么是流？**
stream（流）是一种抽象的数据结构。就像数组或字符串一样，流是数据的集合。

- **为什么用流**
一般小文件的读写操作是把文件内容全部读入内存，然后再写入文件。但是遇到大文件就会有问题。
```js
//  下面是一个简单的流文件的创建
import * as fs from 'fs'

const stream = fs.createWriteStream('./asset/big_file.txt')
for (let i = 0; i < 1000000; i++) {
  stream.write(`这是第${i}行的内容\n`)
}

stream.end()
```
:::

## 核心API
### 文件系统模块（fs）
Node.js 通过 V8 注入了 fs 的 api 给 js 用，底层是通过 c++ 调用操作系统的文件系统功能。

fs模块中常用的一些api：
- fs.open()：打开文件返回描述符
- fs.readFile()：读取文件
- fs.writeFile()：写入文件(复写，非添加)
- fs.stat()：用来获取文件信息
- fs.rename()：于重命名文件或目录，它可以指定文件或目录的旧路径和新路径，从而实现重命名的功能。（原文件会被删除）
- fs.unlink()：删除文件

:::detail 问题点记录
1. 问题1 --- open 和 readFile api 之间的区别？
回答1：--- fs.open()用于打开文件，它可以指定文件的路径、文件的访问模式（读、写、读写）等，并返回一个文件描述符，用于后续的文件操作。而fs.readFile()则是用于读取文件，它可以指定文件的路径，并返回文件的内容。

2. 问题2 --- 文件描述符是什么？
回答2：--- 文件描述符是一个整数，用于指定一个打开的文件。它是由fs.open()函数返回的，可以用于后续的文件操作，比如fs.read()、fs.write()等。

3. 问题3 --- fs.read 和 fs.readFile 之间的区别？
回答3：
  - 1. fs.read()可以指定读取文件的起始位置和读取的字节数，而fs.readFile()只能读取整个文件。
  - 2. fs.read()可以读取文件的一部分，而fs.readFile()只能读取整个文件。
  - 3. fs.read()可以读取二进制文件，而fs.readFile()只能读取文本文件。
基于问题3衍生的理解如下：
当一个文件需要部分截取，而不是整个文件读写的时候，就需要使用 `fs.open()` 将文件打开，然后使用`fs.read()`和`fs.write()`两种方式对文件进行读写。 **相反：** 如果要读整个文本文件就可以直接用
`readFile`和`writeFile`两种读写就行。

4. 文件系统标识 [详见页面](http://nodejs.cn/api-v16/fs.html#file-system-flags)
:::

以下是一个简单的读取整个文件的异步（只能通过回调函数获取结果）抽象类
```js
class handleTextFile {
  filePath: string = ''
  alltext: string = ''
  constructor(props: any) {
    this.filePath = props.path
  }

  getFileInfo = () => {
    fs.stat(this.filePath, (err, stats) => {
      return stats
    })
  }

  readFile = () => {
    fs.readFile(this.filePath, 'utf-8', (err, data) => {
      if (err) throw err
      this.alltext = data
      return data
    })
  }

  writeFile = (extraCtx: string) => {
    fs.writeFile(this.filePath, extraCtx, function(err) {
      if (err) throw err
      console.log('编辑成功');
    })
  }

  deleteFile = () => {
    fs.unlink(this.filePath, (err) => {
      if (err) throw err
      console.log('文件删除成功');
    })
  }

  removeFile = (path: string) => {
    fs.rename(this.filePath, path, (err) => {
      if (err) throw err
      console.log('文件名修改成功');
    })
  }
}
```

### 文件路径模块（path
path模块介绍
- path.basename()可以获取文件名；
- path.dirname()可以获取路径名；
- path.extname()可以获取文件扩展名；
- path.join()可以拼接路径；
- path.parse()可以解析路径；
- path.resolve()可以解析绝对路径。

### http模块（http）**
简单实现一个前端静态资源的部署功能
:::tip
有一下几个之前的误区，记录一下。
1. 不光是请求，资源存放位置也是通过路由判断存放的。如下例所示：css,js,html文件，分别放在对应不同的路由下面。
2. 请求首页的时候，css和js资源的请求不是服务器一并返回的，而是通过 `link`和`script`标签发起的 get 请求获取的
:::

```js
import * as http from 'node:http'
import * as fs from 'node:fs'
import path from 'node:path';

const hostname = '127.0.0.1';
const port = 3000;
const dirPath = './dist'

interface SourceItem {
  route: string;
  header: string;
  ctx: Buffer;
}

const fileType: any = {
  '.html': { type: 'text/html', route: '/' },
  '.css': { type: 'text/css', route: '/index.css' },
  '.js': { type: 'text/javascript', route: '/index.js' },
}

const getHtmlSources = () => {
  const pathList = fs.readdirSync(dirPath)

  const list: SourceItem[] = []
  for (let i = 0; i < pathList.length; i++) {
    const item = pathList[i]
    const data = fs.readFileSync(`${dirPath}/${item}`)

    const listItem: SourceItem = {
      route: fileType[path.extname(item)].route,
      header: fileType[path.extname(item)].type,
      ctx: data,
    }

    list.push(listItem)
  }

  return list
}

const sourceList = getHtmlSources()

const server = http.createServer((req, res) => {
  sourceList.forEach((i: SourceItem) => {
    if (req.url === i.route) {
      res.statusCode = 200
      res.setHeader('Content-type', i.header)
      res.end(i.ctx)
    }
  })

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

### Buffer 缓冲区
用于处理二进制数据的特殊数据类型，它可以用来存储任意类型的数据，如字符串、图片、视频等。它可以用来处理网络数据流、处理文件、实现数据加密等


