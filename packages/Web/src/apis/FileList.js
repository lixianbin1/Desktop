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