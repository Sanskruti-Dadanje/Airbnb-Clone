const express = require("express");
const router = express.Router();
const Reservation = require("../models/reservation");
const Listing = require("../models/listing");
const {isLoggedIn}  = require("../middleware");
const reservationController=require("../controllers/reservation")
const userController=require("../controllers/user")




router.post("/listings/:id/trips", isLoggedIn,reservationController.renderBooking);

router.delete('/reservations/:id', isLoggedIn, reservationController.deleteReservation);
  

module.exports = router;
