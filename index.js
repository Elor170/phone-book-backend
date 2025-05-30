import express from 'express'
import morgan from 'morgan'
import { Person } from './Services/database.js'
import 'dotenv/config'
const { PORT } = process.env

const app = express();
app.use(express.json())
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))
app.use(express.static('dist'))

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(people => response.json(people))
    .catch(err => next(err))
})

app.get('/info', (request, response, next) => {
  Person.find({})
    .then(result => {
      const data = `Phone book has info for ${result.length} people\n\n${new Date()}`
      response.contentType('text/plain')
      response.send(data)
    })
    .catch(err => next(err))

})

app.get('/api/persons/:id', (request, response, next) => {
  const { id } = request.params

  Person.findById(id)
    .then(result => {
      if (result)
        response.json(result)
      else
        response.status(404).end()
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const { id } = request.params

  Person.findByIdAndDelete(id)
    .then(res =>
      response.status(204).end()
    )
    .catch(err => next(err))
})

app.post('/api/persons/', (request, response, next) => {
  const { name, number } = request.body

  if (!name || !number)
    response.status(400).json({ error: 'Name or number is missing' })


  else {
    Person.findOne({ name })
      .then(result => {
        if (result)
          response.status(400).json({ error: 'Name must be unique' })

        else {
          const newPerson = new Person({
            name: name,
            number: number
          })
          newPerson.save()
            .then(res => response.json(res))
            .catch(err => next(err))
        }
      })
      .catch(err => next(err))
  }

})

app.put('/api/persons/:id', (req, res, next) => {
  const { id } = req.params
  const newData = req.body
  const { name, number } = newData

  if (!name || !number)
    response.status(400).json({ error: 'Name or number is missing' })

  else {
    Person.findOneAndReplace({ _id: id }, { name, number }, { new: true, runValidators: true })
      .then(result => {
        if (result)
          res.json(result)
        else
          res.status(404).json({ error: 'Id not found' })
      })
      .catch(err => next(err))
  }
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' })
  }
  else if (error.name === 'ValidationError')
    return response.status(400).json({error: error.message}) 

  next(error)
}

app.use(errorHandler)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
