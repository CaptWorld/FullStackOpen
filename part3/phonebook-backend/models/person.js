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
    number: {
        type: String,
        validate: {
            validator: (number) => number.length >= 8 && /^\d{2,3}-\d+$/.test(number),
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'User phone number required']
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObj) => {
        returnedObj.id = returnedObj._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
