import require from './require'
import axios from 'axios';
const auto = import.meta.env.VITE_APP_Auto
const network = import.meta.env.VITE_APP_NetWork

export const FileList = function (params){
  return require({
    url: `${network}/${auto}/file/list`,
    method: 'get',
    params
  })
}

export const FileInfo = function (data){
  return require({
    url: `${network}/${auto}/file`,
    method: 'post',
    data
  })
}

export const FileUpload = function (data){
  return require({
    url: `${network}/${auto}/file/update`,
    method: 'post',
    data
  })
}

export const FileDelete = function (data){
  return require({
    url: `${network}/${auto}/file/delete`,
    method: 'post',
    data
  })
}

export const FilesDelete = function (data){
  return require({
    url: `${network}/${auto}/file/deleteDir`,
    method: 'post',
    data
  })
}

export const FileCreate = function (data){
  return require({
    url: `${network}/${auto}/file/create`,
    method: 'post',
    data
  })
}