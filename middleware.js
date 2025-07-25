const Listing=require("./models/listing");
const ExpressError = require("./utils/ExpressError");

const {listingSchema,reviewSchema}=require("./schema.js");




module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listing");
        return res.redirect("/login");

    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    const currUser=res.locals.currUser
    console.log(listing.owner._id.equals);
    console.log(res.locals.currUser);
    if(!currUser &&listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You dont have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();

    }

        
    };

    module.exports.validateReview=(req,res,next)=>{
        let {error}=reviewSchema.validate(req.body);
        if(error){
            let errMsg=error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,errMsg);
        }else{
            next();
        }

            
        
    }

    module.exports.isreviewAuthor=async(req,res,next)=>{
        let{id,reviewId}=req.params;
        let review=await Review.findById(reviewId);
        if(!review.author.equals(res.locals.currUser._id)){
            req.flash("error","You are not author of this author");
            return res.redirect(`/listings/${id}`);
        }
        next();
    }
