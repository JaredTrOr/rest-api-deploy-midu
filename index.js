/*
REST API --> Software architecture
Representational state transfer
*/ 

const express = require('express')
const app = express()
const movies = require('./movies.json')
const crypto = require('node:crypto')
const cors = require('cors')
const {validateMovie, validatePartialMovie} = require('./schemas/movies.js')
const PORT = process.env.PORT ?? 3000
app.disable('x-powered-by')

app.use(express.json())
app.use(cors())

app.get('/', (req,res) => {
    res.send('Welcome to my server')
})

//All movie resources are identified with /movies
//Endpoint is a path where you have a resource
app.get('/movies', (req,res) => {
    res.header('Access-Control-Allow-Origin', '*')

    const {genre} = req.query

    if (genre) {
        const filteredMovies = movies.filter(movie => {
            return movie.genre.some(element => element.toLowerCase() === genre.toLowerCase())
        })

        return res.json(filteredMovies)
    }
    
    res.json(movies)
})

app.get('/movies/:id', (req,res) => { //path-to-regexp
    const {id} = req.params
    const movieId = movies.find(movie => movie.id === id)

    if (movieId) return res.json(movieId)

    res.status(404).json({message: 'Movie not found'})
})

app.post('/movies', (req,res) => {

    //Validate all the values of the req.body
    const result = validateMovie(req.body)

    if (result.error) {
        // 422 Unprocessable Entity
        // 400 Bad Request
        return res.status(400).json({error: JSON.parse(result.error.message)})
    }

    //Create the new movie (this is an example and it doesn't follow the REST architecutre)
    const newMovie = {
        id: crypto.randomUUID(), //uuid v4
        ...result.data
    }

    movies.push(newMovie)
    res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req,res) => {

    //Validate the data of the movie
    const result = validatePartialMovie(req.body)
    if (result.error) return res.status(400).json({error: JSON.parse(result.error.message)})

    //Find the movie
    const {id} = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)

    // If the movie doesn't exist, return 404
    if (movieIndex === -1) return res.status(404).json({message: 'Movie not found'})

    //Update the movie
    console.log(movies[movieIndex])
    console.log(result.data)

    const updatedMovie = {
        ...movies[movieIndex],
        ...result.data
    }

    console.log('Updated movie')
    console.log(updatedMovie)

    movies[movieIndex] = updatedMovie

    return res.json(updatedMovie)
})

app.delete('/movies/:id', (req,res) => {
    const {id} = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) return res.status(404).json({message: 'Movie not found'})

    movies.splice(movieIndex, 1)

    return res.json({message: 'Movie deleted'})
})

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${port}`)
})
