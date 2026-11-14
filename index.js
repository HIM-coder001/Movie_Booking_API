import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import movieRoutes from './routes/movie.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;  

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use(movieRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

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