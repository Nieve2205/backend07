import express from 'express';
import cors from 'cors';
import db from './app/models/index.js';
import authRoutes from './app/routes/auth.routes.js';
import userRoutes from './app/routes/user.routes.js';
require('dotenv').config();

const app = express();

// Configuración CORS actualizada
const allowedOrigins = [
  'http://localhost:8080', // Original
  'http://localhost:3002', // Tu frontend React
  'http://localhost:3000'  // Por si acaso
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (como Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Node.js JWT Authentication API.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/test', userRoutes);

// Puerto
const PORT = process.env.PORT || 3000;

// Iniciar servidor
db.sequelize.sync({ force: false })
  .then(() => {
    console.log("Database synchronized");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch(err => {
    console.error("Database sync error:", err);
  });