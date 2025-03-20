import express from "express";
import Nedb from "nedb";
import jwt from 'jsonwebtoken';

const __SecretKey = process.env.XD_SECRETKEY;
const __HomePath = process.env.XD_HomePath
const __rootname = __HomePath + "\\NodeServer"

const router = express.Router();
const userDB = new Nedb({
    filename: __rootname + '\\DB\\user.db',
    autoload: true
});

// 注册
router.post('/register',(req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json({
            code: 400,
            message: '用户名密码不能为空'
        });
    }
    userDB.findOne({ username }, (err, doc) => {
        if (doc) {
            return res.json({
                coe: 400,
                message: '用户名已存在'
            });
        }
        // 插入数据
        userDB.insert({ username, password ,tokenVersion: 1}, (err, doc) => {
            if (err) {
                return res.json({
                    code:500,
                    message: '用户注册失败'
                });
            }
            res.json({
                code: 200,
                message: '用户注册成功',
            });
        });
    });


})

// 登录
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json({
            code: 400,
            message: '用户名密码不能为空'
        });
    }
    userDB.findOne({ username, password }, (err, doc) => {
        if (!doc) {
            return res.json({
                code: 400,
                message: '用户名密码错误'
            });
        }
        // 更新 tokenVersion
        const newTokenVersion = doc.tokenVersion + 1;
        userDB.update({ _id: doc._id }, { $set: { tokenVersion: newTokenVersion } }, {}, (err, numReplaced) => {
            if (err) {
                return res.json({
                    code: 500,
                    message: '更新 tokenVersion 失败'
                });
            }

            // 生成 JWT
            const token = jwt.sign({ id: doc._id, username: doc.username, tokenVersion: newTokenVersion }, __SecretKey, { expiresIn: '1h' });
            res.json({
                code: 200,
                message: '用户登录成功',
                token
            });
        });
    });
})

// 获取用户信息
router.get('/userinfo', (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.json({
            code: 401,
            message: '未登录'
        });
    }
    userDB.findOne({ _id: decoded.id }, (err, doc) => {
        if (err) {
            return res.json({})
        }
        res.json({
            code: 200,
            data: doc
        });
    });
})

// 退出登录
router.post('/logout', (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.json({
            code: 401,
            message: '未登录'
        });
    }
    const newTokenVersion = doc.tokenVersion + 1;
    userDB.update({ _id: doc._id }, { $set: { tokenVersion: newTokenVersion } }, {}, (err, numReplaced) => {
        if (err) {
            return res.json({
                code: 500,
                message: '退出失败'
            });
        }
        res.json({
            code: 200,
            message: '用户退出成功',
        });
    });
})
export default router;