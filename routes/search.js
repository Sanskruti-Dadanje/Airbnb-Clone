const express = require("express");
const router = express.Router();
const Listing = require("../models/listing"); // Mongoose model

router.get("/search", async (req, res) => {
  const { category } = req.query;

  let query = {};
  if (category) {
  
   query.category = { $regex: category, $options: "i" };
  }

  try {
    const listings = await Listing.find(query);
    res.render("listings/index.ejs", { allListings: listings });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

module.exports = router;
