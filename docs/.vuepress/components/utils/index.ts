import { faker } from '@faker-js/faker';

// 获取 wav文件基础信息
export class WavHead {
  buffer: ArrayBuffer;
  constructor(buffer) {
    this.buffer = buffer.slice(0, 80)
  }

  get chunkSize() {
    const size = new Int32Array(this.buffer.slice(4, 8)).join('');
    console.log('size:', size);
    return parseInt(size);
  }

  // 获取文件格式 wav 为 WAVE
  get formType() {
    const type = String.fromCharCode.apply(null, new Uint8Array(this.buffer.slice(8, 12)))
    console.log('type: ', type)
    return type
  }
  
  get subChunkSize() {
    const subSize = new Int32Array(this.buffer.slice(16, 20)).join('')
    console.log('subSize', subSize);
    return parseInt(subSize)
  }

  // 1代表PCM无损格式
  get audioFormat() {
    const audioFormat = new Int16Array(this.buffer.slice(20, 22)).join('')
    console.log('audioFormat', audioFormat);
    return audioFormat
  }

  // 声道数 1或2
  get channels() {
    const channels = new Int16Array(this.buffer.slice(22, 24)).join('')
    console.log('channels', channels);
    return channels
  }

  get simpleRate() {
    const rate = new Int32Array(this.buffer.slice(24, 28)).join('');
    console.log('rate:', rate);
    return parseInt(rate);
  }

  get byteRate() {
    const byteRate = new Int32Array(this.buffer.slice(28, 32)).join('');
    console.log('byteRate', byteRate);
    return byteRate
  }

  get bitsPerSample() {
    const bits = new Int16Array(this.buffer.slice(34, 36)).join('');
    console.log('bits:', bits);
    return parseInt(bits);
  }
}

// buffer 转 base64 函数
export const arrayBufferToBase64Img = (buffer: ArrayBuffer, type: any):string => {
  const str = String.fromCharCode(...new Uint8Array(buffer))
  return `data:${type};base64,${window.btoa(str)}`
}

// mock数据生成工具
export const makeMockData = (
  len: number, 
  type: 'simple' | 'hard' = 'simple',
): any[] => {
  let data = []
  for (let id = 0; id < len; ++id) {
    data.push({
      id,
      value: type === 'simple' ? 'item' + id : faker.lorem.sentences()
    });
  }
  return data
}

export enum CompareResult {
  eq = 1,
  lt,
  gt
}

export function binarySearch<T, VT> (
  list: T[],
  topVal: VT,
  compareFunc: (current: T, value: VT) => CompareResult
) {
  let start = 0
  let end = list.length - 1
  let tempIndex = null
  while (start <= end) {
    tempIndex = Math.floor((start + end) / 2);
    const midValue = list[tempIndex]
    const compareRes: CompareResult = compareFunc(midValue, topVal);
    if (compareRes === CompareResult.eq) {
      return tempIndex;
    }
    if (compareRes === CompareResult.lt) {
      start = tempIndex + 1;
    } else if (compareRes === CompareResult.gt) {
      end = tempIndex - 1;
    }
  }
  return tempIndex
}