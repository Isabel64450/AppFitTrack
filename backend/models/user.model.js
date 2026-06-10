

const db = require('../config/database');
const bcrypt = require('bcrypt');

// Nombre de "tours" de hachage bcrypt. Plus c'est élevé, plus c'est lent
// (et donc plus résistant aux attaques par force brute), mais aussi plus
// coûteux en CPU. 10 est la valeur recommandée par défaut.
const SALT_ROUNDS = 10;

const UserModel = {
  async create({ username, email, password, weight, goal }) {
    // On hache le mot de passe AVANT de l'insérer en base.
    // bcrypt.hash() génère un sel aléatoire et produit un hash de 60 caractères.
    // Même si la BDD est compromise, les mots de passe restent illisibles.
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // db.execute() utilise des requêtes préparées avec des `?` (paramètres liés).
    // Chaque `?` est remplacé de façon sécurisée — protège contre l'injection SQL.
    // Ne JAMAIS concaténer des variables directement dans une requête SQL.
    const [result] = await db.execute(
      'INSERT INTO User (username, email, password, weight, goal) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, weight || null, goal || 'maintain']
    );

    return result.insertId;
  },
  async findByEmail(email) {
    const [rows] = await db.execute(
      'SELECT * FROM User WHERE email = ?',
      [email]
    );    
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await db.execute(
      'SELECT id, username, email, weight, goal, created_at FROM User WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  
  async findByUsername(username) {
    const [rows] = await db.execute(
      'SELECT id FROM User WHERE username = ?',
      [username]
    );
    return rows[0] || null;
  },

  
  async update(id, { username, weight, goal }) {
    
    const fields = [];
    const values = [];

    if (username !== undefined) { fields.push('username = ?'); values.push(username); }
    if (weight !== undefined) { fields.push('weight = ?'); values.push(weight); }
    if (goal !== undefined) { fields.push('goal = ?'); values.push(goal); }

    if (fields.length === 0) return null;

    values.push(id);

    await db.execute(`UPDATE User SET ${fields.join(', ')} WHERE id = ?`, values);

    return this.findById(id);
  },

  // ---- Vérifier le mot de passe lors du login ----
  // bcrypt.compare() re-hash le mot de passe en clair avec le sel stocké dans
  // le hash, puis compare. Retourne true si ça correspond, false sinon.
  async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  },
};

module.exports = UserModel;