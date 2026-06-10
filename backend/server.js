const express    = require('express');
const cors       = require('cors');
const dotenv     = require('dotenv');

dotenv.config();
// Charge les variables du fichier .env dans process.env
// DOIT être appelé avant tout require des modules qui utilisent process.env

const authRoutes     = require('./routes/auth.routes');
const exerciseRoutes = require('./routes/exercise.routes');
const workoutRoutes  = require('./routes/workout.routes');
const statsRoutes    = require('./routes/stats.routes');

const app  = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
// Parse automatiquement les Corps de requête JSON
// Sans ça, req.body est undefined pour les POST/PUT

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
// CORS : autorise les requêtes depuis le frontend

app.use('/api/auth',      authRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/workouts',  workoutRoutes);
app.use('/api/stats',     statsRoutes);

// ── Route de health check ─────────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({ message: 'FitTrack API is running', version: '1.0' });
});


app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});


if (process.env.NODE_ENV !== 'test') {
  // Ne lie pas le port si on est en mode test (Jest gère ça)
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
}

module.exports = app;
// Export de l'app pour les tests Supertest (pas besoin de listen)