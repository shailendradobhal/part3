require("dotenv").config()
const express = require("express")
const router = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const Person = require("./models/person")

router.use(cors())
router.use(bodyParser.json())
router.use(express.static("build"))

router.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.json(persons.map(person => person.toJSON()))
    })
    .catch(error => next(error))
})

router.get("/info", (req, res) => {
  res.set("Content-Type", "text/html")
  const html = `<p>Phonebook has info for people</p>
     <p>${new Date()}</p>
    `
  res.end(html)
})

router.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person.toJSON())
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

router.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

router.put("/api/persons/:id", (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    phone: body.phone
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(person => {
      res.json(person.toJSON())
    })
    .catch(error => next(error))
})

router.post("/api/persons", (req, res, next) => {
  const body = req.body

  const person = new Person({
    name: body.name,
    phone: body.phone
  })

  person
    .save()
    .then(person => {
      res.json(person.toJSON())
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

//handler of request for unknown endpoint
router.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === "CastError" && error.kind === "ObjectId") {
    return response.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

router.use(errorHandler)

const PORT = process.env.PORT

router.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`)
})
