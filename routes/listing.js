const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
// const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage })




const listingController=require("../controllers/listing.js");

//index route
router.route
("/")
.get(wrapAsync(listingController.index))
.post(
   isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing));





//new route
router.get("/new",isLoggedIn,listingController.renderForm);



//show route,update,delete
router.route
("/:id")
.get(wrapAsync(listingController.showListing))
.put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListng))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));









//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm)
    

);





// Route for viewing listings by category
router.get("/category/:x", listingController.getCategoryListings);




module.exports=router;