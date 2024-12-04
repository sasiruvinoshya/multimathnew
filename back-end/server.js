const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const axios = require('axios');
const { updateStats } = require('./controllers/authController');

const app = express();
const server = http.createServer(app); // Reuse the same server instance


// MongoDB Atlas connection
const mongoURI = 'mongodb+srv://sasiru:49QDyz4AeH5qdh08@clusterpro.7yqsr.mongodb.net/?retryWrites=true&w=majority&appName=Clusterpro';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.error('MongoDB Connection Failed:', err));

// Middleware to parse JSON
app.use(express.json());

// CORS middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow frontend origin
  methods: 'GET,POST,PUT,DELETE',
  credentials: true // This enables sending cookies with requests if needed
}));

// Use the routes
app.use('/api', authRoutes); // Mounting the routes at /api





// Example route
app.get('/', (_req, res) => {
  res.send('Server is running');
});

// Banana Challenge route
app.get('/banana-challenge', async (req, res) => {
  try {
    const response = await axios.get('http://marcconrad.com/uob/banana/api.php');
    res.json(response.data); // Send the response back to the frontend
  } catch (error) {
    console.error('Error fetching Banana Challenge:', error.message);
    res.status(500).json({ error: 'Error fetching Banana Challenge' });
  }
});




// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
