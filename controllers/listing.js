const Listing=require("../models/listing");
const axios = require("axios"); 
     







module.exports.index = async (req, res, next) => {
    try {
        const { category,country } = req.query; 
        let query = {}; 
        if (category) {
             query.category = category;
        }

        if (country) {
           
            query.country = { $regex: country, $options: 'i' };
            console.log(query.country);
        }

      


        const allListings = await Listing.find(query); 

           if (allListings.length === 0) {
    return res.render("error.ejs", { message: "No listings found for your search!" });
}


         
        
        res.render('listings/index.ejs', { allListings, selectedCategory: category ,searchedCountry: country,});
    } catch (err) {
        next(err);
    }
};



    //create new listing
module.exports.renderForm=
        (req,res)=>{
            res.render('listings/new.ejs')
};
    

        //show listing
 module.exports.showListing=async(req,res)=>{
            let {id}=req.params;
            
            
            const listing= await Listing.findById(id)
            .populate({path:"reviews",
                populate:{
                    path:"author",
                },
            }).populate("owner");
            if(!listing){
                req.flash("error","Listing you requested for does not exist");
                res.redirect("/listings");
            }
                   console.log(listing);
            res.render('listings/show.ejs',{listing});
        
}



   

        
// Create new listing with geocoding
module.exports.createListing = async (req, res, next) => {
    try {
        
        const newListing = new Listing(req.body.listing);
        
        newListing.owner = req.user._id;
        
        if (req.file) {
            newListing.image ={
                url: req.file.path,
                filename: req.file.filename
            };
            console.log("Uploaded Files:", req.file);
          
        }

        const address = req.body.listing.location; 
        const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

        const response = await axios.get(geocodeUrl);
        if (response.data.length > 0) {
            const lat = response.data[0].lat;
            const lon = response.data[0].lon;
            newListing.geometry = { type: "Point", coordinates: [lon, lat] };
        } else {
            req.flash("error", "Location not found. Please enter a valid address.");
            return res.redirect("/listings/new");
        }

        await newListing.save();
        console.log(newListing);
        req.flash("success", "New Listing Created");
        res.redirect("/listings");
    } catch (err) {
        console.error(err);
        next(err);
    }
};

        
        
       


        //edit listing
module.exports.renderEditForm=async(req,res)=>{
            let {id}=req.params;
            const listing=await Listing.findById(id);
            if(!listing){
                req.flash("error","Listing you requested for does not exist!");
                res.redirect("/listings");
            }
            
             let originalImageUrl='';
             if (listing.image && listing.image.url) {
                originalImageUrl = listing.image.url.replace("/upload", "/upload/w_250");
            }

            res.render('listings/edit.ejs',{listing,originalImageUrl});
};




        //update listing
module.exports.updateListng=async(req,res)=>{
            let {id}=req.params;
           
            let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

            if (req.file ) {
         listing.image  ={ url: req.file.path, filename: req.file.filename };
        
            }


            await listing.save();
            
            console.log(listing);
            req.flash("success","listing updated");
            res.redirect(`/listings/${id}`);
}
        
        


        

        //delete listing
module.exports.destroyListing=async(req,res)=>{
            let {id}=req.params;
            let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
}


        // Controller for viewing listings by category
module.exports.getCategoryListings = async (req, res) => {
    try {
        const { x } = req.params; 
        
        const listings = await Listing.find({ category: x });

        if (!listings || listings.length === 0) {
            req.flash('error', `No listings found for category: ${x}.`);
            return res.redirect('/listings'); 
        }

        res.render("listings/category.ejs", { listings, category: x });
    } catch (err) {
        req.flash('error', `Error fetching listings for category ${req.params.x}.`);
        res.redirect('/listings');
    }
};