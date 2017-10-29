/**
 * Created by wangzhen on 2017/8/21.
 */

exports.login= function (req, res, next) {

  var findUser = function(name, password){
    const user={name:'wang',password:'123456'}
    return name===user.name?user:undefined
  };

  var sess = req.session;
  var user = findUser(req.body.name, req.body.password);

  if(user){
    req.session.regenerate(function(err) {
      if(err){
        return res.render('index',{ret_code: 2, ret_msg: '登录失败'});
      }

      req.session.loginUser = user.name;
      res.render('index',{ret_code: 0, ret_msg: '登录成功'});
    });
  }else{
    res.render('index',{ret_code: 1, ret_msg: '账号或密码错误'});
  }
};

exports.loginOut= function (req, res, next) {
  // 备注：这里用的 session-file-store 在destroy 方法里，并没有销毁cookie
  // 所以客户端的 cookie 还是存在，导致的问题 --> 退出登陆后，服务端检测到cookie
  // 然后去查找对应的 session 文件，报错
  // session-file-store 本身的bug

  req.session.destroy(function(err) {
    if(err){
      res.render('index',{ret_code: 2, ret_msg: '退出登录失败'});
      return;
    }

    // req.session.loginUser = null;
    res.clearCookie('skey');
    res.redirect('/');
  });
}

