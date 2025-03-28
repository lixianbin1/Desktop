const {Monitor} = require('node-screenshots')
const sharp = require('sharp')

const windows = Monitor.all() 
function toCapture(socket,key = 'capture'){
    windows.forEach(item => {
        item.captureImage().then(async (data) => {
            const image = await data.toPng()
            const sharping = await sharp(image).png({
                quality:10
            }).toBuffer()
            const base64 = sharping.toString('base64')
            socket.emit(key, base64)
        })
    })
}
let Interval
function capture (socket){
    toCapture(socket)
}

function captureing(socket,time=1000){
    toCapture(socket,'captureing')
    Interval = setInterval(()=>{
        toCapture(socket,'captureing')
    },time)
}
function closeCapture(){
    clearInterval(Interval)
}

module.exports = {capture,captureing,closeCapture}