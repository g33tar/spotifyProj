var express = require('express'),
  router = express.Router(),
  db = require('monk')(process.env.MONGOLAB_URI),
  songs = db.get('songs'),
  spotify = require('spotify');

console.log(songs);
/* GET users listing. */
router.get('/', function(req, res, next) {
  songs.find({}, function(err, docs){
    if (err) throw err
    res.render('songs/index', {songs: docs, email: req.session.email})
    })
  })

router.post('/', function(req, res, next) {
  songs.insert(req.body, function(err, doc){
    if (err) throw err;
    songs.find({}, function(err, docs){
      if (err) throw err
      spotify.search({ type:'artist', query: req.body.query},
      function(err, data) {
        res.render('songs/index', {songs:docs, data:data})
      })
    })
  })
})


router.get('/new', function(req, res, next) {
  res.render('songs/new')
})

router.post('/:id/delete', function(req, res, next) {
  songs.remove({_id: req.params.id}, function(err, doc){
    if (err) throw err
    res.redirect('/songs')
  })
})




module.exports = router;
