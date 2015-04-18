require! ['express']
router = express.Router! 
require! fs
require! formidable
require! util
require! mongoose
require! User:'../models/user'
TITLE = "uploadHomeWork"
AVATAR_UPLOAD_FOLDER = '/avatar/'


is-authenticated = (req, res, next)-> if req.is-authenticated! then next! else res.redirect '/'

module.exports = (passport)->
  router.get '/', (req, res)!-> res.render 'index', message: req.flash 'message'

  router.post '/login', passport.authenticate 'login', {
    success-redirect: '/home', failure-redirect: '/', failure-flash: true
  }

  router.get '/signup', (req, res)!-> res.render 'register', message: req.flash 'message'

  router.post '/signup', passport.authenticate 'signup', {
    success-redirect: '/home', failure-redirect: '/signup', failure-flash: true
  }

  router.get '/home', is-authenticated, (req, res)!-> res.render 'home', user: req.user

  router.get '/signout', (req, res)!-> 
    req.logout!
    res.redirect '/'


  router.post '/DL' ,(req, res)!->
    User.update {}, {$set:{deadLine : req.body.DDL}}, {multi:true} ,(err,numberAffected,rawResponse)!->
      if err
        console.log err
      else
        console.log "Changed"

      console.log numberAffected
      console.log rawResponse
    


  router.get '/hw', (req, res)!->
    User.find  {},(err, homeworks)->
      if(err)
        console.log err
      res.render 'hw' hw:homeworks

  router.post '/upload' (req, res)!->
    form = new formidable.IncomingForm!
    form.uploadDir = './bin/public'


    form.parse req, (err, fields, files) !->
      res.writeHead 200, {'content-type': 'text/plain'}
      myDate = new Date();
      User.update {username : req.user.username}, {$set: {submit : myDate.toLocaleString(),homeWork : req.user.username + '.zip'}}, { multi: true }, (err,numberAffected, rawResponse) ->
        if err
          console.log err
        else
          console.log "Test222222222222222222222222222222222222222"

        console.log numberAffected
        console.log rawResponse

      console.log req.user.username
      res.write 'uploaded'
      newPath = form.uploadDir + "/HW_" + req.user.username 
      fs.renameSync(files.fulAvatar.path, newPath)
      console.log newPath
      res.end!

  

