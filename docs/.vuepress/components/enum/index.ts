/**
 * wav 格式文件参数枚举值
 */
export enum WavParams {
  chunkSize = '块数据域大小',
  formType = '类型码', 
  subChunkSize = '子块数据域大小',
  audioFormat = '编码格式',
  channels = '声道数',
  byteRate = '传输速率',
  simpleRate = '采样率', 
  bitsPerSample = '单个采样位深',
}