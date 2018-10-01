var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
  email: { type:String, required : true, unique: true},
  username: { type:String, required : true},
  password: { type:String, required : true}
});

userSchema.pre('save',function(next){
    if(!this.isModified('password'))
      return next();

    bcrypt.hash(this.password,null,null,(err,hash)=> {
        if(err) return next(err);
        this.password = hash;
        next();
    });
});

userSchema.methods.comparePassword = function(password){
  return bcrypt.compareSync(password,this.password);
};

module.exports = mongoose.model('User', userSchema);
