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
      // Verificação 1: Checa se o email já existe
      const emailExists = await connection('users').where('email', email).first();
      if (emailExists) {
        return response.status(400).json({ error: "Este e-mail já está em uso." });
      }

      // Verificação 2 (NOVA): Checa se o username já existe, caso tenha sido enviado
      if (username) {
        const usernameExists = await connection('users').where('username', username).first();
        if (usernameExists) {
          return response.status(400).json({ error: "Este nome de usuário já está em uso." });
        }
      }

      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);

      const skills_for_db = skills && skills.length > 0 ? `{${skills.join(',')}}` : null;

      const [newUser] = await connection('users').insert({
        name,
        username: username || null,
        email,
        password_hash,
        role,
        course,
        gender,
        skills: skills_for_db,
        bio,
        availability
      }).returning('*');

      const { password_hash: _, ...userWithoutPassword } = newUser;

      return response.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      // Verifica se o erro é de duplicidade para dar uma mensagem mais específica
      if (error.code === '23505') {
        if (error.constraint === 'users_username_unique') {
          return response.status(400).json({ error: "Este nome de usuário já está em uso." });
        }
        if (error.constraint === 'users_email_key') { // O nome da constraint pode variar
          return response.status(400).json({ error: "Este e-mail já está em uso." });
        }
      }
      return response.status(500).json({ error: "Ocorreu um erro ao criar o usuário." });
    }
  }
};