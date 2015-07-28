require('dotenv').load()

var express = require('express'),
    router = express.Router(),
    db = require('monk')(process.env.MONGOLAB_URI),
    users = db.get('users'),
    bcrypt = require('bcryptjs')

/* GET landing page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express'});
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express'});
})

router.post('/login', function(req, res) {
  var loginErrors = [];
  if(!req.body.email) {
    loginErrors.push("Email cannot be blank" );
  }
  if (!req.body.password) {
    loginErrors.push(" Password cannot be blank")
  }
  if (loginErrors.length) {
    res.render('login', {loginErrors: loginErrors})
  }
  else {
    users.findOne({email: req.body.email}, function (err, doc) {
      if (err) return err;
      if (doc) {
        if (bcrypt.compareSync(req.body.password, doc.password)) {
          req.session.id = doc._id;
          res.redirect('/songs')
        }
        else {
          loginErrors.push('Incorrect email and password combo')
          res.render('login', {loginErrors: loginErrors})
        }
      }
      else {
        loginErrors.push('User not found. Please register')
        res.render('login', {loginErrors: loginErrors})
      }
    })
  }
})


//GET register
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Express'});
})

//register POST
router.post('/register', function(req, res) {
  var errors = []
  if(!req.body.email) {
    errors.push("Email cannot be blank" )
  }
  if (!req.body.password) {
    errors.push(" Password cannot be blank")
  }
  if (errors.length) {
    res.render('register', {errors: errors})
  }
   else {
    users.find({email: req.body.email}, function (err, docs) {
        if (docs.length === 0) {
      req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
      users.insert(req.body, function(err, doc){
        if (err) return err
          req.session.id = doc._id
          res.redirect('/songs')
        })
      } else {
          errors.push('Login invalid')
          res.render('register', {errors: errors})
        }
      })
    }
})
//about
router.get('/about', function(req, res, next) {
  res.render('about');
});


//logout route
router.get('/logout', function(req, res){
  req.session = null
  res.redirect('/')
})

module.exports = router;
