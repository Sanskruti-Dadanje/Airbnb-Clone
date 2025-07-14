const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const Listing=require("../models/listing.js")
const userController=require("../controllers/user.js")
const Reservation = require("../models/reservation");
const {isLoggedIn}=require("../middleware.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));
    
    

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
}),

userController.login);



router.get("/logout",userController.logout);

// Route for viewing user's trips/reservations
router.get("/trips", isLoggedIn, userController.getTrips);

// Route for viewing user's profile
router.get("/profile", isLoggedIn, userController.getProfile);




module.exports=router;