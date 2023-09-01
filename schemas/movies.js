const zod = require('zod')

const movieSchema = zod.object({
    title: zod.string({
        invalid_type_error: 'Movie title must be a string',
        required_error: 'Movie title is required'
    }),
    year: zod.number().int().min(1900).max(2024),
    director: zod.string(),
    duration: zod.number().int().positive(),
    rate: zod.number().min(0).max(10).default(0),
    poster: zod.string().url({
        message: 'Poster must be a valid URL'
    }),
    genre: zod.array(
        zod.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Thriller', 'Sci-Fi', 'Crime'])
    )
})

function validateMovie(object) {
    return movieSchema.safeParse(object)
}

function validatePartialMovie(object) {
    return movieSchema.partial().safeParse(object)
}

module.exports = {
    validateMovie,
    validatePartialMovie
}