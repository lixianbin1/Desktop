const jwt = require('jsonwebtoken');

const __SecretKey = process.env.XD_SECRETKEY;

// jwt验证插件
const verification =(req,res,next)=>{
  let token = req.headers.authorization
  if(token){
    try {
      jwt.verify(token, __SecretKey, (err, decoded) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            return res.json({ code: 401, message: 'Token 已过期，请重新登录' });
          } else if (err.name === 'JsonWebTokenError') {
            return res.json({ code: 401,  message: '无效的 Token' });
          } else {
            return res.json({ code: 401, message: '无权限访问' });
          }
        } else {
          req.user = decoded;
          next();
        }
      });
    } catch (error) {
      res.json({code: 401, message: '无权限访问' });
    }
  }else{
    res.json({ code: 401, message: '无权限访问' });
  }
}

module.exports = verification;