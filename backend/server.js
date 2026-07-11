const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/products',require('./routes/ProductRoutes'));
  app.use('/api/orders', require('./routes/orderRoutes'))
  app.use('/api/appointments', require('./routes/AppointmentRoutes'));
  app.use('/api/queries', require('./routes/queryRoutes'));
app.get('/', (req, res) => {
  res.send('👓 Optical Store API is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
