import request from '@/utils/request'

// 查询缓存详细
export function uploadFile(data) {
  return request({
    url: '/api/common/upload',
    method: 'post',
    data: data
  })
}


//上传音频
export function uploadFile2(data) {
  return request({
    url: '/api/common/fileUploadMP3',
    method: 'post',
    data: data
  })
}


