import {Monitor} from 'node-screenshots'
import sharp from 'sharp'

const windows = Monitor.all() 
function toCapture(socket){
    windows.forEach(item => {
        item.captureImage().then(async (data) => {
            const image = await data.toPng()
            const sharping = await sharp(image).png({
                quality:10
            }).toBuffer()
            const base64 = sharping.toString('base64')
            socket.emit('capture', base64)
        })
    })
}
let Interval
export function capture (socket){
    toCapture(socket)
}

export function captureing(socket,time=1000){
    toCapture(socket)
    Interval = setInterval(()=>{
        toCapture(socket)
    },time)
}
export function closeCapture(){
    clearInterval(Interval)
}