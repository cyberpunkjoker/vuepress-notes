## TypeScript
#### ts基础
```ts
//--------------基本类型----------------
{  
  let isDone: boolean = false;
  let count: number = 1;
  let name: string = 'tom';

  // js中没有空值，ts中可以用 void 表示没有任何返回值 (只能赋值 undefined or null)
  function getInfo(): void {}
  let unusable: void = undefined || null

  let u: undefined = undefined
  let n: null = null

  // any 表示任意类型
  let notCare: any = { a: 1 }
}
//----------------------------------------

// 联合类型使用 | 分隔每个类型。
let myFavoriteNumber: string | number;

// 对象的类型 - 接口
interface Person {
  readonly id: number //只读属性
  name: string
  age?: 123 //可选属性
  [propName: string]: any //任意属性
}
let tom = { name: 'tom' }

// 数组的类型
let fibonacci: number[] = [1,2,3]
let fibonacci: Array<number> = [1,2,3] // (泛形)
  //类数组
  interface args: {
    [index: number]: number;
    length: number;
    callee: Function;
  }

// 函数的类型
function sum(x: number, y: number): number {
    return x + y;
}
// 函数定义重载
  // 意思是: 输入为数字的时候，输出也应该为数字，输入为字符串的时候，输出也应该为字符串。
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string | void {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}

```

::: tip
- 与`void`的区别是，`undefined`和`null`是所有类型的子类型。也就是说`undefined`类型的变量，可以赋值给`number`等类型的变量
- 变量如果在声明的时候，未指定其类型(且未设置初始值)，那么它会被识别为任意值类型：
- TypeScript 会在没有明确的指定类型的时候推测出一个类型
  - 如下所示 ⬇️ (两种等效)
  ```ts
  let myFavoriteNumber = 'seven';
  let myFavoriteNumber: string = 'seven';
  ```
- 一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集
  - 意思如下
  ```ts
  interface Iany {
    name: string,
    age?: number,
    [propName: string]: string | number, // 任意属性至少要包含 string 和 number
  }
  ```
:::

#### 函数类型
我们可以给每个参数添加类型之后再为函数本身添加返回值类型。 TypeScript能够根据返回语句自动推断出返回值类型，因此我们通常省略它。
```ts
function add(x: number, y: number): number {
    return x + y;
}
let myAdd = (x: number, y: number): number => { return x + y };
```

#### 类型断言
类型断言：可以用来手动指定一个值的类型
一般使用情况：
1. 将一个联合类型断言为其中一个类型
2. 将一个父类断言为更加具体的子类

总之，若 A 兼容 B，那么 A 能够被断言为 B，B 也能被断言为 A。

同理，若 B 兼容 A，那么 A 能够被断言为 B，B 也能被断言为 A

```ts
let str: any = '2434'
let len = (str as string).length

// 子类 DEMO
class ApiError extends Error {
    code: number = 0;
}
class HttpError extends Error {
    statusCode: number = 200;
}
function isApiError(error: Error) {
    if (error instanceof ApiError) {
        return true;
    }
    return false;
}
```

### ts新语法索引
- declare var 声明全局变量
- declare function 声明全局方法
- declare class 声明全局类
- declare enum 声明全局枚举类型
- declare namespace 声明（含有子属性的）全局对象
- interface 和 type 声明全局类型
- export 导出变量
- export namespace 导出（含有子属性的）对象
- export default ES6 默认导出
- export = commonjs 导出模块
- export as namespace UMD 库声明全局变量
- declare global 扩展全局变量
- declare module 扩展模块
- /// `<reference />` 三斜线指令
:::details
- 类似于声明文件中的 import，它可以用来导入另一个声明文件。
- 三斜线的使用场景：（与 import 之间的区别）
  - 当我们在书写一个全局变量的声明文件时
  - 当我们需要依赖一个全局变量的声明文件时
:::

### 内置对象
**ECMA 内置对象**: `Boolean`、`Error`、`Date`、`RegExp` 等

**DOM 和 BOM 提供的内置对象有**：`Document`、`HTMLElement`、`Event`、`NodeList` 等。

:::tip
TypeScript 核心库的定义文件中定义了所有浏览器环境需要用到的类型，并且是预置在 TypeScript 中的。

在使用原生方法时，ts已经对方法进行了校验。
:::


## TS简单使用技巧
#### 1. 枚举
枚举成员会被赋值为从 0 开始递增的数字，同时也会对枚举值到枚举名进行反向映射
```ts
enum Days {
  Sun = 7, 
  Mon = 1, 
  Tue = 2, 
  Wed = 3, 
  Thu = 4, 
  Fri = 5, 
  Sat = 6,
}
console.log(Days.Sun);  // 7
console.log(Days[7]);   // Sun
```
#### 2. 类实现接口
实现（implements）是面向对象中的一个重要概念
 
 举例： 门是一个类，防盗门是门的子类。如果防盗门有一个报警器的功能，我们可以简单的给防盗门添加一个报警方法。这时候如果有另一个类，车，也有报警器的功能，就可以考虑把报警器提取出来，作为一个接口，防盗门和车都去实现它
```ts
// 警报器接口
interface Alarm {
  alert(): void
}

class Door {}
class SecuityDoor extends Door implements Alarm {
  alert() { console.log('balala') }
}

class Car implements Alarm {
  alert() { console.log('balala') }
}
// 同时 一个类也 支持 实现多个接口
class Car implements Alarm, Light {}
// 接口与接口之间可以是继承关系：
interface LightableAlarm extends Alarm {
    lightOn(): void;
    lightOff(): void;
}
```

#### 3. 泛型
  泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。

```ts
function createArray<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray<string>(3, 'x'); // ['x', 'x', 'x']
// 也可以不手动指定，类型推断自动推算出来
createArray(3, 'x'); // ['x', 'x', 'x']

// 多个参数类型的情况 --------------------------
function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]];
}

swap([7, 'seven']); // ['seven', 7]

// ----⬇️-- 泛型约束 --⬇️----
// arg 类型不定， 但是一定要有 length 属性 时
interface Lengthwise {
    length: number;
}
function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}
loggingIdentity(7);
```
#### 4.一些扩充
- `readonly`具有`ReadonlyArray<T>`类型
```ts {1}
let arr: ReadonlyArray<number> = [2,3,4,3,34,3]
```
- 高级类型
:::details 高级类型log
1. *交叉类型* 
```ts {8}
interface IProps1 {
  count: number
}
interface IProps2 {
  name: string
}

let obj: Array<IProps1 & IProps2> = [{count: 1, name: 'stm'}]
```
2.  *联合类型*
```ts {2}
type C = string | number
let status: C = 1
```
:::

:::details 一些简单的面试点
- 1. **void 和 never 之间的区别？**
    
    void: void 表示没有任何返回值 (只能赋值 undefined or null)
    
    never: never类型表示的是那些永不存在的值的类型,比如 DEMO ⬇️
    ```ts {2}
    function error(message: string): never {
      throw new Error(message);
    }
    ```
:::