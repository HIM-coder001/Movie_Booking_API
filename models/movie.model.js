import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    title:{ 
        type: String, required: true
    },
    description:{
        type: String, required: true
    },
    casts:{
        type:[String], required: true
    },
    trailerUrl:{
        type: String, required: true
    },
    language:{
        type: String, required: true, default: 'English'
    },
    releaseDate:{
        type: Date, required: true
    },
    director:{
        type: String, required: true
    },
    duration: {
        type: Number, // Duration in minutes (e.g., 120)
        required: [true, 'Movie duration is required'],
    },
    genre: {
        type: [String], //(e.g., ["Action", "Sci-Fi"])
        required: [true, 'At least one genre is required'],
    },
    posterImage: {
        type: String, 
        required: [true, 'Poster image is required'],
    },
    releaseStatus:{
        type: String, required: true, enum: ['RELEASED', 'COMING SOON', 'BLOCKED' , 'ENDED'], default: 'RELEASED'
    },
},{
    timestamps: true
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;