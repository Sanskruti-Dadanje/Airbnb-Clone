const User=require("../models/user.js");
const Reservation = require('../models/reservation');


//render signup form
module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
}
 
//signup logic
module.exports.signup=async(req,res,next)=>{
    try{
        let{username,email,password}=req.body;
        const newUser=new User({email,username});
            const registeredUser=await User.register(newUser,password);
            req.login(registeredUser,(err)=>{
                if(err){
                    return next(err);
                }
                req.flash("success","Welcome to Wanderlust!");
                    res.redirect("/listings");
                });
            }catch(e){
                req.flash("error",e.message);
                res.redirect("/signup");

            }
            
    
};

//render login form
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

//login logic
module.exports.login=async(req,res)=>
    {
        req.flash("success","Welcome back to Wanderlust");
        let redirectUrl=res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    }






//logout logic
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
       if(err){
        return next(err);
       } 
       req.flash("success","you are logged out");
       res.redirect("/listings");
    });}


// Controller for viewing user's trips/reservations
module.exports.getTrips = async (req, res) => {
    try {
        const reservations = await Reservation.find({ user: req.user._id }).populate("listing");
        const filteredReservations = reservations.filter(res => res.listing !== null);
        res.render("users/reservations", { reservations:filteredReservations });
    } catch (err) {
        req.flash('error', 'Error fetching your trips.');
        res.redirect('/listings'); 
    }
};

// Controller for viewing user's profile
module.exports.getProfile = async (req, res) => {
    try {
        

        let  x = await User.findOne( req.user._id );
        res.render("users/profile", { user: req.user }); 
    } catch (err) {
        req.flash('error', 'Error fetching profile.');
        res.redirect('/listings');
    }
};
