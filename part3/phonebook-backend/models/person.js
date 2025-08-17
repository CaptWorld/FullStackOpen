const mongoose = require('mongoose')

const MONGO_URI = process.env.MONGO_URI

mongoose.set('strictQuery', false)

mongoose
    .connect(MONGO_URI)
    .then(result => {
        console.log('Successfully connected to MongoDB')
    })
    .catch(error => {
        console.error("Failed to connect to MongoDB", error)
    })

const personSchema = mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObj) => {
        returnedObj.id = returnedObj._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
