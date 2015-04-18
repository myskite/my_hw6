(function(){
  var express, router, fs, formidable, util, mongoose, User, TITLE, AVATAR_UPLOAD_FOLDER, isAuthenticated;
  express = require('express');
  router = express.Router();
  fs = require('fs');
  formidable = require('formidable');
  util = require('util');
  mongoose = require('mongoose');
  User = require('../models/user');
  TITLE = "uploadHomeWork";
  AVATAR_UPLOAD_FOLDER = '/avatar/';
  isAuthenticated = function(req, res, next){
    if (req.isAuthenticated()) {
      return next();
    } else {
      return res.redirect('/');
    }
  };
  module.exports = function(passport){
    router.get('/', function(req, res){
      res.render('index', {
        message: req.flash('message')
      });
    });
    router.post('/login', passport.authenticate('login', {
      successRedirect: '/home',
      failureRedirect: '/',
      failureFlash: true
    }));
    router.get('/signup', function(req, res){
      res.render('register', {
        message: req.flash('message')
      });
    });
    router.post('/signup', passport.authenticate('signup', {
      successRedirect: '/home',
      failureRedirect: '/signup',
      failureFlash: true
    }));
    router.get('/home', isAuthenticated, function(req, res){
      res.render('home', {
        user: req.user
      });
    });
    router.get('/signout', function(req, res){
      req.logout();
      res.redirect('/');
    });
    router.post('/DL', function(req, res){
      User.update({}, {
        $set: {
          deadLine: req.body.DDL
        }
      }, {
        multi: true
      }, function(err, numberAffected, rawResponse){
        if (err) {
          console.log(err);
        } else {
          console.log("Changed");
        }
        console.log(numberAffected);
        console.log(rawResponse);
      });
    });
    router.get('/hw', function(req, res){
      User.find({}, function(err, homeworks){
        if (err) {
          console.log(err);
        }
        return res.render('hw', {
          hw: homeworks
        });
      });
    });
    return router.post('/upload', function(req, res){
      var form;
      form = new formidable.IncomingForm();
      form.uploadDir = './bin/public';
      form.parse(req, function(err, fields, files){
        var myDate, newPath;
        res.writeHead(200, {
          'content-type': 'text/plain'
        });
        myDate = new Date();
        User.update({
          username: req.user.username
        }, {
          $set: {
            submit: myDate.toLocaleString(),
            homeWork: req.user.username + '.zip'
          }
        }, {
          multi: true
        }, function(err, numberAffected, rawResponse){
          if (err) {
            console.log(err);
          } else {
            console.log("Test222222222222222222222222222222222222222");
          }
          console.log(numberAffected);
          return console.log(rawResponse);
        });
        console.log(req.user.username);
        res.write('uploaded');
        newPath = form.uploadDir + "/HW_" + req.user.username;
        fs.renameSync(files.fulAvatar.path, newPath);
        console.log(newPath);
        res.end();
      });
    });
  };
}).call(this);
