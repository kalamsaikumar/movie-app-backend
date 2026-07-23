const Movie = require("../models/Movie");


// ADD MOVIE
const addMovie = async (req, res) => {

    try {

        const {
            movieName,
            hero,
            releaseYear,
            director,
            genre,
            rating,
            runtime
        } = req.body;

        const movie = new Movie({

            user: req.user.id,
            movieName,
            hero,
            releaseYear,
            director,
            genre,
            rating,
            runtime
        });

        await movie.save();

        res.status(201).json({
            message: "Movie Added Successfully",
            movie
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
};



// GET ALL MOVIES OF LOGGED IN USER
const getMovies = async (req, res) => {

    try {

        const { 
            search,
            hero,
            year,
            director,
            rating
        } = req.query;


        // Base query
        let query = {
            user: req.user.id
        };


        // SEARCH
        if (search) {

            query.$or = [

                {
                    movieName: {
                        $regex: search,
                        $options: "i"
                    }
                },

                {
                    genre: {
                        $regex: search,
                        $options: "i"
                    }
                },

                {
                    hero: {
                        $regex: search,
                        $options: "i"
                    }
                },

                {
                    director: {
                        $regex: search,
                        $options: "i"
                    }
                }

            ];
        }


        // FILTER HERO
        if (hero) {
            query.hero = hero;
        }


        // FILTER DIRECTOR
        if (director) {
            query.director = director;
        }

        // FILTER YEAR
        if (year) {
            query.releaseYear = year;
        }


        // FILTER RATING
        if (rating) {
            query.rating = rating;
        }


        // GET MOVIES
        const movies = await Movie.find(query);

        res.status(200).json(movies);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
};

// DELETE MOVIE
const deleteMovie = async (req, res) => {

    try {

        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        // Check ownership
        if (movie.user.toString() !== req.user.id) {

            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        await Movie.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Movie Deleted Successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
};




// UPDATE MOVIE
const updateMovie = async (req, res) => {

    try {

        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return res.status(404).json({
                message: "Movie not found"
            });
        }

        // Check ownership
        if (movie.user.toString() !== req.user.id) {

            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                returnDocument : 'after'
            }
        );

        res.status(200).json({message : "Moive updated successfully",updatedMovie});

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
};




module.exports = {
    addMovie,
    getMovies,
    deleteMovie,
    updateMovie
};