process.env.JWT_SECRET = 'test-jwt-secret-fittrack-testing-key-256bits';

process.env.JWT_EXPIRES_IN = '1d';

// NODE_ENV=test est utilisé dans server.js pour NE PAS démarrer
// le serveur HTTP (app.listen). Supertest crée son propre serveur temporaire.
process.env.NODE_ENV = 'test';