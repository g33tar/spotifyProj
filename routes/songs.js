var express = require('express'),
  router = express.Router(),
  db = require('monk')(process.env.MONGOLAB_URI),
  songs = db.get('songs'),
  spotify = require('spotify');

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
    spotify.search({ type:'artist', query: req.body },
    function(err, data) {
      console.log(data.artists.items[0].images[1]);
      res.render('songs/index', data)
    });
  })
})


router.get('/new', function(req, res, next) {
  res.render('songs/new')
})





module.exports = router;
