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

**？1. 如何使用二进制读取文件？**
1. 先查询对应文件格式的文件头信息。
2. 使用 buffer 获取前面几位。通过对比确认是什么文件。
读取文件头，代码展示：⬇️
```ts
const bufLen = 10

function getFileHeader(filePath: string) { 
  const fd = fs.openSync(filePath, 'r');
  const buffer = Buffer.alloc(bufLen);
  fs.readSync(fd, buffer, 0, bufLen, 0);
  fs.closeSync(fd); 
  return buffer; 
} 
// 解析文件头信息 
function parseFileHeader(heade: Buffer) {

  console.log('header', header.toString());
  
  if (header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4E && header[3] === 0x47) { 
    return 'png'; 
  } else if (header[0] === 0xFF && header[1] === 0xD8) { 
    return 'jpg'; 
  } else if (header[0] === 0x47 && header[1] === 0x49 && header[2] === 0x46) { 
    return 'gif'; 
  } else if (header[0] === 0xFF && header[1] === 0xD8 && header[6] === 0x4A && header[7] === 0x46 && header[8] === 0x49 && header[9] === 0x46 && header[10] === 0x00) { 
    return 'jpeg'; 
  } else { return null; } 
} 
```

**？2. 如何实现文件格式的转换？**

问题记录一下：
- 在获取`PNG`文件的时候 第一位 `0x89 -> 137` 。第一个字节0x89超出了ASCII字符的范围，这是为了避免某些软件将PNG文件当做文本文件来处理。


编码类型相关：
一般常用的编码类型有：ASCII， UTF-8，UTF-16，Unicode 这几种，

中国内常用的GBK，GB232，BIG-5 不支持使用。

### Stream
流的作用就是传递数据，读写方式是把文件内容读入内存中，然后再写入文件。当遇到大文件的时候就需要把文件拆成小块，一块一块的运输。


## 跨域问题
某些请求不会触发 CORS 预检请求。在废弃的 CORS 规范中称这样的请求为简单请求，但是目前的 Fetch 规范（CORS 的现行定义规范）中不再使用这个词语。

对于一些复杂请求 会预先发起一个 option 请求，然后根据服务器的响应，判断是否允许跨域。

跨域的一些理解可以看这篇
(1)[https://juejin.cn/post/7045070446848376869]
(2)[https://cloud.tencent.com/developer/article/2009296]

主要需要明确两点，
1. 浏览器拦截的是返回结果不是请求（请求还是发出去了的）
2. 复杂请求和简单请求的处理是不一样的，复杂需要先 预请求 一次判断（option）


## HTTP
**HTTP头部参数包括：（部分）**
- Content-Type，用于指定响应的内容类型；
- Content-Length，用于指定响应的内容长度；
- Cache-Control，用于指定客户端缓存的策略；
- Connection，用于指定客户端与服务器之间的连接状态；
- Date，用于指定响应的发送时间；
- Expires，用于指定响应的过期时间；
- Server，用于指定服务器的名称；
- Set-Cookie，用于指定客户端的Cookie；
- Transfer-Encoding，用于指定响应的传输编码方式；
- Vary，用于指定客户端可以接受的响应类型；
- X-Powered-By，用于指定服务器使用的技术。

**MIME 类型:（部分）**
- text/plain，用于指定纯文本格式；
- text/html，用于指定HTML格式；
- application/json，用于指定JSON格式；
- application/xml，用于指定XML格式；
- image/jpeg，用于指定JPEG图片格式；
- image/png，用于指定PNG图片格式；
- audio/mpeg，用于指定MPEG音频格式；
- video/mp4，用于指定MP4视频格式；
- application/octet-stream，用于指定任意二进制格式。


1. 比如你的网站从 HTTP 升级到了 HTTPS 了，以前的站点再也不用了，应当返回301，这个时候浏览器默认会做缓存优化，在第二次访问的时候自动访问重定向的那个地址。
而如果只是暂时不可用，那么直接返回302即可，和301不同的是，浏览器并不会做缓存优化。



### Accept
2. HTTP 从MIME type取了一部分来标记报文 body 部分的数据类型，这些类型体现在Content-Type这个字段，当然这是针对于发送端而言，接收端想要收到特定类型的数据，也可以用Accept字段。
具体而言，这两个字段的取值可以分为下面几类:

text： text/html, text/plain, text/css 等
image: image/gif, image/jpeg, image/png 等
audio/video: audio/mpeg, video/mp4 等
application: application/json, application/javascript, application/pdf, application/octet-stream



Content-Type：通常以MIME类型的形式表示，指定请求或响应中包含的实体的媒体类型。帮助接收方解析数据。


发送端 
1. Content-Encoding: gzip                  压缩方式
2. Content-Language: zh-CN, zh, en         支持语言
3. Content-Type: text/html; charset=utf-8  字符集

接收端 
1. Accept-Encoding: gzip
2. Accept-Language: zh-CN, zh, en
3. Accept-Charset: charset=utf-8



定长与不定长
Content-Length: 10  限制长度，如果超出长度页面会无法访问
Transfer-Encoding: chunked 不定长


http中处理表单提交中不同类型对应的后端解析情况：

1. application/x-www-form-urlencoded: name=yahah&age=109
2. multipart/form-data: 
```
------WebKitFormBoundaryBIqPugThGUAZ0QTW
Content-Disposition: form-data; name="name"

yahah
------WebKitFormBoundaryBIqPugThGUAZ0QTW
Content-Disposition: form-data; name="age"

109
------WebKitFormBoundaryBIqPugThGUAZ0QTW--
```
3. application/json: {"name":"yahah","age":109}


### cookie
```ini
// 请求头
Cookie: a=xxx;b=xxx
// 响应头
Set-Cookie: a=xxx
set-Cookie: b=xxx
```

cookie 的生命周期：
Expires: 过期时间 
Max-Age: 用的是一段时间间隔，单位是秒，从浏览器收到报文开始计算

cookie 的作用域：
Domain: 指定了 Cookie 可以被发送到哪些域名
path: 可以被发送到哪些路径下的 URL

```js
// 在 www.example.com 中设置一个 Cookie
res.setHeader('Set-Cookie', 'user=123; domain=.example.com; path=/api; Max-Age=3600');
```

cookie 安全相关：
Secure：只能通过 HTTPS 传输cookie
HttpOnly：只能通过 HTTP 协议传输，不能使用 JS 访问
SameSite：可以设置 Strict，Lax，None
- a. 在Strict模式下，浏览器完全禁止第三方请求携带Cookie。比如请求sanyuan.com网站只能在sanyuan.com域名当中请求才能携带 Cookie，在其他网站请求都不能。
- b. 在Lax模式，就宽松一点了，但是只能在 get 方法提交表单况或者a 标签发送 get 请求的情况下可以携带 Cookie，其他情况均不能。
- c. 在None模式下，也就是默认模式，请求会自动携带上 Cookie。


cookie 的缺点：
1. 容量小，只有4KB
2. 性能有问题，域名下的所有地址的请求都会带上完整的 cookie。但是可以通过 Domain 和 path指定作用域
3. 安全问题，在 非httpOnly 的情况下，cookie信息可以通过 JS脚本读取。


### 缓存相关
Cache-Control: private 或者 public
s-maxage: 限定了缓存在代理服务器中可以存放多久


```
Cache-Control: public, max-age=1000, s-maxage=2000
```
翻译一下的意思是：响应是允许代理服务器缓存的，客户端缓存过期了到代理中拿，并且在客户端的缓存时间为 1000 秒，在代理服务器中的缓存时间为 2000 s。


**强制缓存：**
expires: 服务端返回的数据到期时间
cache-control: 
- private：客户端可以缓存 
- public：客户端和代理服务器都可以缓存 
- max-age=t：缓存内容将在t秒后失效 
- no-cache：需要使用协商缓存来验证缓存数据 
- no-store：所有内容都不会缓存。
Etag: 通过此字段告诉浏览器当前资源在服务器生成的唯一标识


