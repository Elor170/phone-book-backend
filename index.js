import express from 'express'
import morgan from 'morgan'

let notes = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

const PORT = 3001
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

app.get('/api/persons', (request, response) => {
  response.json(notes)
})

app.get('/info', (request, response) => {
  const data = `Phone book has info for ${notes.length} people\n\n${new Date()}`
  response.contentType('text/plain')
  response.send(data)
})

app.get('/api/persons/:id', (request, response) => {
  const { id } = request.params
  const note = notes.find(note => note.id === id)

  if (note)
    response.json(note)
  else
    response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
  const { id } = request.params

  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

app.post('/api/persons/', (request, response) => {
  const { name, number } = request.body

  if (!name || !number)
    response.status(400).json({ error: 'Name or number is missing' })

  else if (notes.some(note => note.name === name)) {
    response.status(400).json({ error: 'Name must be unique' })
  }

  else {
    const id = Math.round(1_000_000 * Math.random()).toString()
    const newNote = { id, name, number }
    notes.push(newNote)
    response.json(newNote)
  }

})

app.put('/api/persons/:id', (req, res) => {
  const { id } = req.params
  const newData = req.body
  const { name, number } = newData

  if (!name || !number)
    response.status(400).json({ error: 'Name or number is missing' })

  else if (!notes.some(note => note.id === id))
    res.status(404).json({ error: 'Id not found' })

  else {
    notes = notes.map(note => note.id === id ? newData : note)
    res.json(newData)
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
