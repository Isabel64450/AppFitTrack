// ============================================================
// models/exercise.model.js — Couche d'accès aux données (table Exercise)
//
// Toutes les requêtes SQL liées aux exercices passent par ici.
// Les contrôleurs appellent ces méthodes sans jamais écrire de SQL.
// ============================================================

const db = require('../config/database');

const ExerciseModel = {

  async findAll({ category, search } = {}) {
    
    let query = 'SELECT * FROM Exercise WHERE 1=1';
    const values = [];
    
    if (category) {
      query += ' AND category = ?';
      values.push(category);
    }

    if (search) {
      query += ' AND (name LIKE ? OR muscle_group LIKE ?)';
      values.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY category, name';
    const [rows] = await db.execute(query, values);
    return rows;
  },

  
  async findById(id) {
    const [rows] = await db.execute('SELECT * FROM Exercise WHERE id = ?', [id]);
    return rows[0] || null;
  },


  async create({ name, category, muscle_group, description }) {
    const [result] = await db.execute(
      'INSERT INTO Exercise (name, category, muscle_group, description) VALUES (?, ?, ?, ?)',
      [name, category, muscle_group || null, description || null]
    );
    // On relit l'exercice créé depuis la BDD pour retourner l'objet complet
    // (avec l'id, created_at, etc.) plutôt que juste l'insertId
    return this.findById(result.insertId);
  },

  async update(id, { name, category, muscle_group, description }) {

    const fields = [];
    const values = [];

    if (name !== undefined) { fields.push('name = ?'); values.push(name); }
    if (category !== undefined) { fields.push('category = ?'); values.push(category); }
    if (muscle_group !== undefined) { fields.push('muscle_group = ?'); values.push(muscle_group); }
    if (description !== undefined) { fields.push('description = ?'); values.push(description); }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    await db.execute(`UPDATE Exercise SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  },

  
  async delete(id) {
    const [result] = await db.execute('DELETE FROM Exercise WHERE id = ?', [id]);

    // affectedRows indique combien de lignes ont été supprimées.
    // Si 0, l'exercice n'existait pas (ou est protégé par une contrainte FK).
    // La contrainte RESTRICT en BDD lèvera une erreur ER_ROW_IS_REFERENCED_2
    // si l'exercice est utilisé dans un WorkoutExercise (géré dans le contrôleur).
    return result.affectedRows > 0;
  },
};

module.exports = ExerciseModel;