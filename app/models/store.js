const mongoose = require('mongoose')
const Schema = mongoose.Schema

const storeSchema= new Schema({
    name: { type: String, required: true},
    image: { type: String, required: true},
    price: { type: Number, required: true},
    use: { type: String, required: true}
    
})

module.exports = mongoose.model('Store', storeSchema)