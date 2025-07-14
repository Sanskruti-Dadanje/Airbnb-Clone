const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const User=require("./user.js");





const listingSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    image: {
        url: String,
    filename: String,
    }
,
    price: Number,
    location: String,
    category: String, 
    country: String,
    geometry: {
        type: { type: String, enum: ["Point"], required: true, default: "Point" },
        coordinates: { type: [Number], required: true } 
    },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});






  
 
//middleware to delete associated reviews when a listing is deleted
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
       await Review.deleteMany({_id:{$in:listing.reviews}}); 
    }
});


//create and export the listing
const  Listing=mongoose.model("Listing", listingSchema);
module.exports=Listing;