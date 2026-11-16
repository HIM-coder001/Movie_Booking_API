import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import movieRoutes from './routes/movie.routes.js';
import errorHandler from './middleware/errorHandler.js'

const app = express();
const PORT = process.env.PORT || 3000;  

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use(movieRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

//Handle 404 Not Found for any route that doesn't exist
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); 
});

app.use(errorHandler); // Use the error handler middleware after all routes

async function startServer() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('Connected to MongoDB successfully');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    }); 

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }};
startServer(); 