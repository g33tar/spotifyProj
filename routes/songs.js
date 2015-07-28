var express = require('express'),
  router = express.Router(),
  db = require('monk')(process.env.MONGOLAB_URI),
  songs = db.get('songs')

/* GET users listing. */
router.get('/', function(req, res, next) {
  songs.find({}, function(err, docs){
    if (err) throw err
    res.render('songs/index', {songs: docs, email: req.session.email})
    })
  })

router.post('/', function(req, res, next) {
  songs.insert(req.body, function(err, doc){
    if (err) throw err
    res.redirect('/songs')
  })
})

router.get('/new', function(req, res, next) {
  res.render('songs/new')
})

router.get('/:id', function(req, res, next) {
  songs.findOne({_id: req.params.id}, function(err, doc){
    if (err) throw err
    res.render('songs/show', doc)
  })
})

router.get('/:id/edit', function(req, res, next) {
  songs.findOne({_id: req.params.id}, function(err, doc){
    if (err) throw err
    res.render('songs/edit', doc)
  })
})

router.post('/:id/update', function(req, res, next) {
  console.log(req.body)
  songs.update({_id: req.params.id}, req.body, function(err, doc){
    if (err) throw err
    res.redirect('/songs/' + req.params.id)
  })
})

router.post('/:id/delete', function(req, res, next) {
  songs.remove({_id: req.params.id}, function(err, doc){
    if (err) throw err
    res.redirect('/songs')
  })
})


module.exports = router;
