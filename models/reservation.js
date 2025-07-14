const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing", // Reference to the listing
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the user who booked
    required: true,
  },
  checkin: {
    type: Date,
    required: true,
  },
  checkout: {
    type: Date,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Reservation", reservationSchema);
