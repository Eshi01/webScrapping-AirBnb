const mongoose = require('mongoose')

const ariBnbDetails = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  title: String,
  rating: Number,
  reviews: String,
})

module.exports = mongoose.model('AirBnb', ariBnbDetails)
