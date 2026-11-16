import mongoose from "mongoose";


const theaterSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [ true , 'Theater name is required' ],
        trim: true,
        unique: true
    },
    location: {
        type: String,
        required: [true, 'City or location is required'],
        trim: true,
    },
    address: {
        type: String,
        required: [true, 'Physical address is required'],
        trim: true,
    },
    totalScreens: {
        type: Number,
        required: [true , "Total number of screens is required"],
        min:[1 , "A theater must have at least 1 screen"]
    },
    amenities: {
        type: [String],
        default: [],
    },
    isActive: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
  }
);

const Theater = mongoose.model('Theater' , theaterSchema);

export default Theater;