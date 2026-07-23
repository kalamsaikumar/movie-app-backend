const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    addMovie,
    getMovies,
    deleteMovie,
    updateMovie
} = require("../controllers/movieController");


// ADD MOVIE
router.post("/", authMiddleware, addMovie);

// GET MOVIES
router.get("/", authMiddleware, getMovies);

// DELETE MOVIE
router.delete("/:id", authMiddleware, deleteMovie);

// UPDATE MOVIE
router.put("/:id", authMiddleware, updateMovie);

module.exports = router;