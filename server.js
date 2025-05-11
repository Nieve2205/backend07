import express from 'express';
import cors from 'cors';
import db from './app/models/index.js';
import authRoutes from './app/routes/auth.routes.js';
import userRoutes from './app/routes/user.routes.js';

const app = express();

// --- Configuración CORS ---
const allowedOrigins = [
  'https://frontend07.onrender.com'
];

const corsOptions = {
  origin: function (origin, callback) {
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

// --- Rutas API ---
app.use('/api/auth', authRoutes);
app.use('/api/test', userRoutes);

// --- Ruta por defecto para rutas no definidas ---
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// --- Puerto e inicio de servidor ---
const PORT = process.env.PORT || 3001;

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
