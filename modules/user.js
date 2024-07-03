const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    //passportLocalMongoose will itself add a username and password with hash and salt field 
    //so it doesnt matter whether we define username and password or not 
    email : {
        type :String,
        required : true,
    } 
});

userSchema.plugin(passportLocalMongoose); //Automatically implements the username, password, hash and salt field by this

module.exports = mongoose.model("User",userSchema)
