var express = require('express'),
  router = express.Router(),
  db = require('monk')(process.env.MONGOLAB_URI),
  gifs = db.get('gifs')

/* GET users listing. */
router.get('/', function(req, res, next) {
  gifs.find({}, function(err, docs){
    if (err) throw err
    res.render('gifs/index', {gifs: docs, email: req.session.email})
    })
  })

router.post('/', function(req, res, next) {
  gifs.insert(req.body, function(err, doc){
    if (err) throw err
    res.redirect('/gifs')
  })
})

router.get('/new', function(req, res, next) {
  res.render('gifs/new')
})

router.get('/:id', function(req, res, next) {
  gifs.findOne({_id: req.params.id}, function(err, doc){
    if (err) throw err
    res.render('gifs/show', doc)
  })
})

router.get('/:id/edit', function(req, res, next) {
  gifs.findOne({_id: req.params.id}, function(err, doc){
    if (err) throw err
    res.render('gifs/edit', doc)
  })
})

router.post('/:id/update', function(req, res, next) {
  console.log(req.body)
  gifs.update({_id: req.params.id}, req.body, function(err, doc){
    if (err) throw err
    res.redirect('/gifs/' + req.params.id)
  })
})

router.post('/:id/delete', function(req, res, next) {
  gifs.remove({_id: req.params.id}, function(err, doc){
    if (err) throw err
    res.redirect('/gifs')
  })
})


module.exports = router;
