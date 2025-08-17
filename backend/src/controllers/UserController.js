// src/controllers/UserController.js

const connection = require('../database/connection');
const bcrypt = require('bcrypt');

module.exports = {
  async index(request, response) {
    try {
      const users = await connection('users').select('*');
      return response.json(users);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return response.status(500).json({ error: "Ocorreu um erro interno." });
    }
  },

  async create(request, response) {
    const { name, username, email, password, role, course, gender, skills, bio, availability } = request.body;

    if (!name || !email || !password || !role) {
      return response.status(400).json({ error: "Campos obrigatórios não foram preenchidos." });
    }

    try {
      const userExists = await connection('users').where('email', email).first();
      if (userExists) {
        return response.status(400).json({ error: "Este e-mail já está em uso." });
      }

      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);

      // CORREÇÃO: Converte o array de skills para o formato que o PostgreSQL espera: '{skill1,skill2}'
      const skills_for_db = skills && skills.length > 0 ? `{${skills.join(',')}}` : null;

      const [newUser] = await connection('users').insert({
        name,
        // CORREÇÃO: Garante que o username seja nulo se estiver vazio, para não violar a restrição UNIQUE
        username: username || null,
        email,
        password_hash,
        role,
        course,
        gender,
        skills: skills_for_db,
        bio,
        availability
      }).returning('*'); // Retorna o usuário criado

      return response.status(201).json(newUser); // Devolve o usuário completo
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      return response.status(500).json({ error: "Ocorreu um erro ao criar o usuário." });
    }
  }
};