const express = require('express');
const fs = require('fs');
const path = require('path');


const router = express.Router();
const __HomePath = process.env.XD_HomePath
// 文件大小
function filesize(stats) {
    if (stats.isDirectory()) {
        return ''; 
    } else {
        return Math.ceil(stats.size / 1024) + 'KB';
    }
}

// 文件类型
function fileType(name, isDirectory) {
    if (isDirectory) {
        return '文件夹';
    } else {
        let lastIndex = name.lastIndexOf(".");
        if (lastIndex == -1) {
            return '文件';
        } else {
            let lastStr = name.substring(lastIndex + 1).toUpperCase();
            return lastStr + '文件';
        }
    }
}

// 读取目录
router.get('/list',(req, res) => {
    const {name} = req.query 
    const direPath = path.join(__HomePath, name || "");
    console.log(direPath)
    try {
        const stats = fs.statSync(direPath);
        if (!stats.isDirectory()) {
            return res.json({
                code: 400,
                message: '非正常目录地址'
            });
        }
        fs.readdir(direPath, (err, files) => {
            if (err) {
                return res.json({
                    code: 400,
                    message: '非正常目录地址'
                });
            }
            const filesAndDirs = files.map(file => {
                const filePath = path.join(direPath, file);
                const fileStats = fs.statSync(filePath);
                return {
                    name: file,
                    type: fileType(file, fileStats.isDirectory()),
                    size: filesize(fileStats),
                    path: name || '',
                    atime: new Date(stats.atime).toLocaleString(),
                    mtime: new Date(stats.mtime).toLocaleString(),
                    ctime: new Date(stats.ctime).toLocaleString(),
                };
            });
            filesAndDirs.sort((a, b) => {
                if (a.type === '文件夹' && b.type !== '文件夹') {
                    return -1;
                }
                if (a.type !== '文件夹' && b.type === '文件夹') {
                    return 1;
                }
                return a.type.localeCompare(b.type)
            });
            const path2 = path.relative(__HomePath, direPath).replace(/\\/g, '/');
            if (name) {
                filesAndDirs.unshift({ name:'...', path: path2 });
            }
            res.json({
                code: 200,
                data: filesAndDirs,
            });
        });
    }catch (error) {
        return res.json({
            code: 400,
            message: '非正常目录地址'
        });
    }
})

// 读取文件
router.post('/',(req, res) => {
    const {filepath,filename} = req.body
    if(!filename){
        return res.json({
            code: 400,
            message: '文件名称不能为空'
        });
    }
    const filePath = path.join(__HomePath, filepath || "", filename || "") 
    const stats = fs.statSync(filePath);
    if (!stats.isFile()) {
        return res.json({
            code: 400,
            message: '指定路径不是一个文件'
        });
    }
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.json({
                code: 500,
                message: '读取文件失败'
            });
        }
        res.type(path.extname(filename)).send({
            code: 200,
            data
        });
    });
})

// 创建文件 or 文件夹
router.post('/create',(req, res) => {
    const {filepath = '',filename,centent} = req.body
    if(!filename){
        return res.json({
            code: 400,
            message: '文件名称不能为空'
        });
    }
    const filePath = path.join(__HomePath, filepath, filename) 

    if (fs.existsSync(filePath)) {
        return res.json({
            code: 409,
            message: '已存在同名文件'
        });
    }
    if(filename.split('.').length > 1 && filename.split('.').length < 3){
        // 创建文件
        fs.writeFile(filePath, centent || "", (err) => {
            if(err) {
                return res.json({
                    code: 500,
                    message: '创建文件失败'
                });
            }
            return res.json({
                code: 200,
                message: '创建文件成功'
            });
        })
    }else if(filename.split('.').length === 1){
        // 创建文件夹
        fs.mkdir(filePath,(err) => {
            if(err) {
                return res.json({
                    code: 500,
                    message: '创建文件夹失败'
                });
            }
            return res.json({
                code: 200,
                message: '创建文件夹成功'
            });
        });
    }else{
        return res.json({
            code: 400,
            message: '文件格式不正确'
        });   
    }
})

// 删除文件
router.post('/delete',(req, res) => {
    const {filepath,filename} = req.body
    if(!filename){
        return res.json({
            code: 400,
            message: '文件名称不能为空'
        });
    }
    const filePath = path.join(__HomePath, filepath, filename) 
    if (!fs.existsSync(filePath)) {
        return res.json({
            code: 404,
            message: '所选目录不存在该文件'
        })
    }
    fs.unlink(filePath, (err) => {
        if(err) {
            return res.json({
                code: 500,
                message: '删除文件失败'
            });
        }
        return res.json({
            code: 200,
            message: '删除文件成功'
        });
    })
})

// 删除文件夹
router.post('/deleteDir',(req, res) => {
    const {filepath} = req.body
    const filePath = path.join(__HomePath, filepath)
    fs.rm(filePath,{ recursive: true }, (err) => {
        if(err) {
            console.log(err)
            return res.json({
                code: 500,
                message: '删除文件夹失败'
            });
        }
        return res.json({
            code: 200,
            message: '删除文件夹成功'
        });
    });
})

// 移动文件
router.post('/move',(req, res) => {
    const {filepath,filename,newfilepath,cover} = req.body
    if(!filename){
        return res.json({
            code: 400,
            message: '文件名称不能为空'
        });
    }
    const filePath = path.join(__HomePath, filepath, filename) 
    const newFilePath = path.join(__HomePath, newfilepath, filename) 
    if (!fs.existsSync(filePath)) {
        return res.json({
            code: 404,
            message: '所选目录不存在该文件'
        })
    }
    if (cover !== true && fs.existsSync(newFilePath)) {
        return res.json({
            code: 409,
            message: '目标文件夹中已存在同名文件'
        });
    }
    fs.rename(filePath, newFilePath, (err) => {
        if(err) {
            return res.json({
                code: 500,
                message: '移动文件失败'
            });
        }
        return res.json({
            code: 200,
            message: '移动文件成功'
        });
    })
})

// 重命名文件
router.post('/rename',(req, res) => {
    const {filepath,filename,newfilename} = req.body
    if(!filename){
        return res.json({
            code: 400,
            message: '文件名称不能为空'
        });
    }
    const filePath = path.join(__HomePath, filepath, filename)
    if (!fs.existsSync(filePath)) {
        return res.json({
            code: 404,
            message: '所选目录不存在该文件'
        })
    }
    const newFilePath = path.join(__HomePath, filepath, newfilename)
    if (fs.existsSync(newFilePath)) {
        return res.json({
            code: 409,
            message: '目标文件夹中已存在同名文件'
        });
    }
    fs.rename(filePath, newFilePath, (err) => {
        if(err) {
            return res.json({
                code: 500,
                message: '重命名文件失败'
            });
        }
        return res.json({
            code: 200,
            message: '重命名文件成功'
        });
    })
})

// 更新文件
router.post('/update',(req, res) => {
    const {filepath,filename,centent} = req.body
    if(!filename){
        return res.json({
            code: 400,
            message: '文件名称不能为空'
        });
    }
    const filePath = path.join(__HomePath, filepath, filename) 
    if (!fs.existsSync(filePath)) {
        return res.json({
            code: 404,
            message: '所选目录不存在该文件'
        })
    }
    fs.writeFile(filePath, centent || "", (err) => {
        if(err) {
            return res.json({
                code: 500,
                message: '更新文件失败'
            });
        }
        return res.json({
            code: 200,
            message: '更新文件成功'
        });
    })
})

// 复制文件
router.post('/copy',(req, res) => {
    const {filepath,filename,newfilepath,cover} = req.body
    if(!filename){
        return res.json({
            code: 400,
            message: '文件名称不能为空'
        });
    }
    const filePath = path.join(__HomePath, filepath, filename) 
    const newFilePath = path.join(__HomePath, newfilepath, filename) 
    if (!fs.existsSync(filePath)) {
        return res.json({
            code: 404,
            message: '所选目录不存在该文件'
        })
    }
    if (cover !== true && fs.existsSync(newFilePath)) {
        return res.json({
            code: 409,
            message: '目标文件夹中已存在同名文件'
        });
    }
    fs.copyFile(filePath, newFilePath, (err) => {
        if(err) {
            return res.json({
                code: 500,
                message: '复制文件失败'
            });
        }
        return res.json({
            code: 200,
            message: '复制文件成功'
        });
    })
})

// 重命名
router.post('/rename',(req, res) => {
    const {filepath,filename,newfilename} = req.body
    if(!filename){
        return res.json({
            code: 400,
            message: '文件名称不能为空'
        });
    }
    const filePath = path.join(__HomePath, filepath, filename)
    if (!fs.existsSync(filePath)) {
        return res.json({
            code: 404,
            message: '所选目录不存在该文件'
        })
    }
    const newFilePath = path.join(__HomePath, filepath, newfilename)
    if (fs.existsSync(newFilePath)) {
        return res.json({
            code: 409,
            message: '目标文件夹中已存在同名文件'
        });
    }
    fs.rename(filePath, newFilePath, (err) => {
        if(err) {
            return res.json({
                code: 500,
                message: '重命名文件失败'
            });
        }
        return res.json({
            code: 200,
            message: '重命名文件成功'
        });
    })
})

module.exports = router;
