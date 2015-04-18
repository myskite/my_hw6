(function(){
  var mongoose;
  mongoose = require('mongoose');
  module.exports = mongoose.model('User', {
    id: String,
    username: String,
    password: String,
    email: String,
    firstName: String,
    lastName: String,
    deadLine: String,
    homeWork: String,
    submit: String
  });
}).call(this);
