const mongoose = require('mongoose')

const ariBnbDetails = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  title: String,
  rating: Number,
  reviews: Number,
})

module.exports = mongoose.model('AirBnb', ariBnbDetails)
