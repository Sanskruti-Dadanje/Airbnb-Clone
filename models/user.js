const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");


//define the user achema
const userSchema=new Schema({
    email:{
        type:String,
        required:true,
       
        
    }
})



userSchema.plugin(passportLocalMongoose);

// Create and export the User model
module.exports = mongoose.model('User', userSchema);
