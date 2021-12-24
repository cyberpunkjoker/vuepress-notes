let count;
count = '123213'

interface Iany {
  readonly id: number,
  name: string,
  // age?: number,
  [propName: string]: string | number,
}

let test: Iany = {
  id: 123,
  name: 'dsd',
  gender: 1,
}


function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string | void {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}

reverse(1)
const str: string = reverse('sdsdsd')

let djfk: any = '2434'
let len = (djfk as string).length

// 枚举的反向映射
enum Days {
  Sun = 7, 
  Mon = 1, 
  Tue = 2, 
  Wed = 3, 
  Thu = 4, 
  Fri = 5, 
  Sat = 6,
}

// console.log(Days.Sun);
// console.log(Days[7]);

// 泛型约束
interface FunProps {
  name: string
}

const fun = <T extends FunProps>(arg:T): T =>{
  return arg
}

// fun({ name: 'sdsd', a: 2312312})
let arr: ReadonlyArray<number> = [2,3,4,3,34,3]
// arr[0] = 23


//交叉类型
interface IProps1 {
  count: number
}
interface IProps2 {
  name: string
}

let obj: Array<IProps1 & IProps2> = [{count: 1, name: 'stm'}]



