/* GET home page. */
/*router.get('/', function(req, res, next) {
 res.render('index', { title: '德玛西亚' });
 });*/
var crypto = require('crypto');
var path = require('path');
var _ = require("underscore")._;
User = require('../models/user.js');
Post = require('../models/post.js');
const LOG = function (val) {
	console.log(val);
};
module.exports = function (app) {
	app.get('/', function (req, res) {
		Post.get(null, function (err, posts) {
			if (err) {
				LOG(err)
				posts = [];
			}

			res.render('index', {
				title: '德玛西亚',
				user: req.session.user,
				posts: posts,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});
		})
	});
	app.get('/reg', checkNotLogin);
	app.get('/reg', function (req, res) {
		res.render('reg', {
			title: '注册',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
	//注册
	app.post('/reg', checkNotLogin);
	app.post('/reg', function (req, res) {
		var name = req.body.name,
			password = req.body.password,
			password_re = req.body['password-repeat'];
		if (password != password_re) {
			console.log("double times diffent");
			req.flash('error', 'double times diffent');
			return res.redirect('/reg');
		}
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		var newUser = new User({
			name: req.body.name,
			password: password,
			email: req.body.email
		});
		User.get(newUser.name, function (err, user) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/');
			}
			if (user) {
				req.flash('error', 'user is exist');
				return res.redirect('/reg');
			}
			newUser.save(function (err, user) {
				if (err) {
					req.flash('error', err);
					return res.redirect('/reg');
				}
				req.session.user = user;
				req.flash('success', 'reg is success');
				res.redirect('/')
			})
		})
	});
	app.get('/login', checkNotLogin);
	app.get('/login', function (req, res) {
		res.render('login', {
			title: '登录',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
	app.post('/login', checkNotLogin);
	app.post('/login', function (req, res) {
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		User.get(req.body.name, function (err, user) {
			if (!user) {
				req.flash('error', 'user is not exist');
				return res.redirect('/login');
			}
			if (user.password != password) {
				req.flash('error', 'pass is wrong');
				return res.redirect('/login');
			}
			LOG(user);
			req.session.user = user;
			req.flash('success', 'login is success');
			return res.redirect('/');
		})
	});
	app.get('/post', checkLogin);
	app.get('/post', function (req, res) {
		res.render('post', {
			title: '发表',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('erroe').toString()
		});
	});
	app.post('/post', checkLogin);
	app.post('/post', function (req, res) {
		var currentUser = req.session.user,
			post = new Post(currentUser.name, req.body.title, req.body.post);
		post.save(function (err) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/');
			}
			req.flash('success', '发布成功');
			res.redirect('/');
		})
	});
	app.get('/logout', function (req, res) {
		LOG(req.session.user);
		req.session.user = null;
		req.flash('success', 'logout is success');
		return res.redirect('/');
	});
	function checkLogin(req, res, next) {
		if (!req.session.user) {
			req.flash("error", "未登录！");
			res.redirect('/login');
		}
		next();
	}

	function checkNotLogin(req, res, next) {
		if (req.session.user) {
			req.flash("error", "已登录！");
			res.redirect('back');
		}
		next();
	}
	app.get('/lotterypage', function (req, res) {
		console.log(__filename);
		res.sendFile(path.join('i://node.js//Express//git//node_blog//webapp//', 'index1.html'));
		//res.render('index', { title: TITLE });
	});
	app.get('/lottery', function (req, res) {
		var lottery = new Map()
		lottery = initLottery();
		// 随机获取一个奖票的ID
		// 810004-->>445286+1W
		//var  str = parseInt(Math.random(455286));
		var str = _.random(0,455286);
		if (lottery.get(str) == null) {
			// 未中奖
			//logger.info("抽中的id：" + str + "为无奖奖票");
			return "0";
		}
		// 删除对应id的价值
		// map.remove(str);
		//logger.info("抽中的id：" + str + "是有奖奖票：" + map.get(str));
		res.json({'obj':lottery.get(str),'message':lottery.get(str)+'元话费'});
	});
	function initLottery(){
		const TICKET_MAP_INFO_ALL =  new Map();
		// 0元 200000个
		// for (int i = 0; i < 200000; i++) {
		// TICKET_MAP_INFO_ALL.put(Integer.toString(i), "0");
		// }
		// 1元 199998个 ———>>2万
		for (var  i = 1; i <= 20000; i++) {
			TICKET_MAP_INFO_ALL.set(i, "1");
		}
		// 2元 191961个 ———>>10万
		for (var i = 20001; i <= 120000; i++) {
			TICKET_MAP_INFO_ALL.set(i, "2");
		}
		// 3元 182755个 ———>>10万
		for (var i = 120001; i <= 220000; i++) {
			TICKET_MAP_INFO_ALL.set(i, "3");
		}
		// 5元 177009个
		for (var i = 220000; i <= 397009; i++) {
			TICKET_MAP_INFO_ALL.set(i, "4");
		}
		// 10元 48277个
		for (var i = 397010; i < 445286; i++) {
			TICKET_MAP_INFO_ALL.set(i, "5");
		}
		//console.log(TICKET_MAP_INFO_ALL);
		return TICKET_MAP_INFO_ALL;
	}
}
