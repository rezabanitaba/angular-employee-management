var mongoose              = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

// User Schema
var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    index:true // Index ensures property is unique in db.
  },
  password: {
    type: String
  },
 email:    {"type": "String", 
                       match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 
                              'Please fill a valid email address']},
  firstName: {
    type: String,
    required: true
  },
  lastName: {
      type: String,
      required: true
  },
  phone: {
    type: String, 
    match: [/\d{3}-\d{3}-\d{4}/, 
           'Please fill a valid phone number']
  },
  address: {
    type: String,
    required: true
},
  roles: {
    type: Array
  },
  salary: {
    type: String
}

});
userSchema.plugin(passportLocalMongoose);
var User = module.exports = mongoose.model('User', userSchema);
module.exports = User;
