const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

mongoose.set("useFindAndModify", false)

const url = process.env.MONGODB_URI

console.log("Connecting to ", url)

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connected successfully")
  })
  .catch(error => {
    console.log("Error connecting to MongoDB", error.message)
  })

//define an schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    minlength: 8,
    required: true
  }
})

personSchema.plugin(uniqueValidator)

personSchema.set("toJSON", {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id.toString()
    delete returnObject._id
    delete returnObject.__v
  }
})

module.exports = mongoose.model("Person", personSchema)
