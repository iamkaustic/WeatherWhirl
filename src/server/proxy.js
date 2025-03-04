import express from 'express';
import cors from 'cors';
import axios from 'axios';
const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());

// Proxy endpoint for Google Geocoding API
app.get('/api/geocode', async (req, res) => {
  try {
    const { lat, lon, key } = req.query;
    if (!lat || !lon || !key) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${key}`
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying geocode request:', error);
    res.status(500).json({ error: 'Failed to fetch geocode data' });
  }
});

// Proxy endpoint for Google Place Details API
app.get('/api/place/details', async (req, res) => {
  try {
    const { place_id, fields, key } = req.query;
    if (!place_id || !key) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=${fields || ''}&key=${key}`
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying place details request:', error);
    res.status(500).json({ error: 'Failed to fetch place details' });
  }
});

// Proxy endpoint for Google Places Nearby Search API
app.get('/api/place/nearbysearch', async (req, res) => {
  try {
    const { location, radius, type, rankby, key } = req.query;
    if (!location || !key) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius || 50000}&type=${type || ''}&rankby=${rankby || ''}&key=${key}`
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying nearby search request:', error);
    res.status(500).json({ error: 'Failed to fetch nearby places' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
