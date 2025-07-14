const express = require("express");
const Reservation = require("../models/reservation");
const Listing = require("../models/listing");







module.exports.renderBooking=async(req,res)=>{   
  const { id } = req.params;
  const { checkin, checkout } = req.body;
  
  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * listing.price;

  
    const reservation = new Reservation({
      listing: id,
      user: req.user._id,
      checkin: checkinDate,
      checkout: checkoutDate,
      totalPrice,
    });

    await reservation.save();

    req.flash("success", "Reservation successful!");
    res.redirect('/trips');
  } catch (error) {
    console.error(error);
    req.flash("error", "Something went wrong!");
    res.redirect(`/listings/${id}`);
  }
};

module.exports.deleteReservation = async (req, res) => {
  const { id } = req.params;

  try {
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      req.flash("error", "Reservation not found.");
      return res.redirect("/trips");
    }

    
    if (!reservation.user.equals(req.user._id)) {
      req.flash("error", "You do not have permission to cancel this reservation.");
      return res.redirect("/trips");
    }

    await reservation.deleteOne();
    req.flash("success", "Reservation cancelled successfully.");
    res.redirect("/trips");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to cancel reservation.");
    res.redirect("/trips");
  }
};

