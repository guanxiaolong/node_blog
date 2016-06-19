
/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: '德玛西亚' });
});*/
var crypto = require('crypto');
User = require('../models/user.js');
Post = require('../models/post.js');
const LOG = function(val){
  console.log(val);
};
module.exports = function(app){
  app.get('/', function(req, res) {
    Post.get(null,function (err,posts) {
        if(err){
            LOG(err)
            posts = [];
        }

      res.render('index', {
      title: '德玛西亚',
      user: req.session.user,
      posts: posts,
      success:req.flash('success').toString(),
      error:req.flash('error').toString()});
    })
  });
    app.get('/reg',checkNotLogin);
  app.get('/reg', function(req, res) {
    res.render('reg', {
      title: '注册',
      user: req.session.user,
      success:req.flash('success').toString(),
      error:req.flash('error').toString()
    });
  });
    //注册
    app.post('/reg',checkNotLogin);
  app.post('/reg', function(req, res) {
    var name = req.body.name,
        password = req.body.password,
        password_re = req.body['password-repeat'];
    if(password!=password_re){
      console.log("double times diffent");
      req.flash('error','double times diffent');
      return res.redirect('/reg');
    }
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
      name:req.body.name,
      password:password,
      email:req.body.email
    });
    User.get(newUser.name,function(err,user){
      if(err){
        req.flash('error',err);
        return res.redirect('/');
      }
      if(user){
        req.flash('error','user is exist');
        return res.redirect('/reg');
      }
      newUser.save(function(err,user){
        if(err){
          req.flash('error',err);
          return res.redirect('/reg');
        }
        req.session.user = user;
        req.flash('success','reg is success');
        res.redirect('/')
      })
    })
  });
    app.get('/login',checkNotLogin);
  app.get('/login', function(req, res) {
    res.render('login', {
      title: '登录',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
    app.post('/login',checkNotLogin);
  app.post('/login', function(req, res) {
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    User.get(req.body.name,function(err,user){
      if(!user){
        req.flash('error','user is not exist');
        return res.redirect('/login');
      }
      if(user.password != password){
        req.flash('error','pass is wrong');
        return res.redirect('/login');
      }
      LOG(user);
      req.session.user = user;
      req.flash('success','login is success');
      return res.redirect('/');
    })
  });
    app.get('/post',checkLogin);
  app.get('/post', function(req, res) {
    res.render('post', {
        title: '发表',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('erroe').toString()
    });
  });
    app.post('/post',checkLogin);
  app.post('/post', function(req, res) {
      var currentUser = req.session.user,
          post = new Post(currentUser.name,req.body.title,req.body.post);
      post.save(function (err) {
          if(err){
              req.flash('error',err);
              return res.redirect('/');
          }
          req.flash('success','发布成功');
          res.redirect('/');
      })
  });
  app.get('/logout', function(req, res) {
    LOG(req.session.user);
    req.session.user = null;
    req.flash('success','logout is success');
    return res.redirect('/');
  });
    function checkLogin(req,res,next) {
        if(!req.session.user){
            req.flash("error","未登录！");
            res.redirect('/login');
        }
        next();
    }
    function checkNotLogin(req,res,next) {
        if(req.session.user){
            req.flash("error","已登录！");
            res.redirect('back');
        }
        next();
    }
}
