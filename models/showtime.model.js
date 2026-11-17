import mongoose from 'mongoose';

const showtimeSchema = new mongoose.Schema({
    movie:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: [ true , "Showtime must be linked to a movie"]
    },
    theater:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theater',
        required: [ true , "Showtime must be linked to a theater"]
    },
    screenNumber:{
        type: Number,
        required: [ true , "Screen number is required"],
        min: [ 1 , "Screen number must be at least 1"]
    },
    startTime:{
        type: Date,
        required: [ true , "Show time is required"]
    },
    ticketPrice:{
        type: Number,
        required: [ true , "Ticket price is required"],
        min: [ 0 , "Ticket price cannot be negative"]
    },
    totalSeats:{
        type: Number,
        required: [ true , "Total seats count is required"],
        min: [ 1 , "Must have at least 1 seat"]
    },
    bookedSeats: {
        type: [String], // e.g ["A1" , "A2" "B5"]
       default: [ ]
    },
    isActive: {
        type: Boolean,
        default: true
    },
},
{
    timestamps: true,
}
);

showtimeSchema.index({ movie: 1 , theater: 1 , startTime: 1 });

const Showtime = mongoose.model ( 'Showtime' , showtimeSchema);

export default Showtime;