const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    movieName : {
        type : String,
        required : true
    },
    hero : {
        type : String,
        required : true
    },
    releaseYear : {
        type : Number,
        required : true
    },
    director : {
        type : String,
        required : true
    },
    genre : {
        type : String,
        required : true
    },
    rating : {
        type : Number,
        min : 1,
        max : 5
    },
    runtime : {
        type : String,
        required : true
    }
},{
    timestamps : true
});

module.exports = mongoose.model('Movie',movieSchema);