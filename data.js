const mongoose = require('mongoose')

const ariBnbDetails = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  title: String,
  host: String,
  rating: Number,
  reviews: Number,
  bedRooms: Number,
  beds: Number,
  baths: Number,
  Cleanliness: Number,
  Accuracy: Number,
  Communication: Number,
  Location: Number,
  Checkin: Number,
  Value: Number,
})

module.exports = mongoose.model('AirBnb', ariBnbDetails)
