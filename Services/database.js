import mongoose from "mongoose"
import 'dotenv/config'

const { MONGODB_URI } = process.env

console.log(`Connecting to database: ${MONGODB_URI}`)
mongoose.connect(MONGODB_URI)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        require: true
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: function (v) {
                return /^\d{2,3}-\d+$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'User phone number required']
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema)


export { Person }