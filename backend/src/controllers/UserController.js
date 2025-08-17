// src/controllers/UserController.js

const connection = require('../database/connection');
const bcrypt = require('bcrypt');

module.exports = {
  // Função para listar todos os usuários (a que já tínhamos)
  async index(request, response) {
    try {
      const users = await connection('users').select('*');
      return response.json(users);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return response.status(500).json({ error: "Ocorreu um erro interno." });
    }
  },

  // Função para CRIAR um novo usuário (Cadastro)
  async create(request, response) {
    const { name, username, email, password, role, course, gender, skills, bio, availability } = request.body;

    if (!name || !email || !password || !role) {
      return response.status(400).json({ error: "Campos obrigatórios não foram preenchidos." });
    }

    try {
      // Verifica se o email já existe
      const userExists = await connection('users').where('email', email).first();
      if (userExists) {
        return response.status(400).json({ error: "Este e-mail já está em uso." });
      }

      // Gera o hash da senha
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);

      // Insere o novo usuário no banco
      await connection('users').insert({
        name,
        username,
        email,
        password_hash, // Salva o hash, não a senha
        role,
        course,
        gender,
        skills,
        bio,
        availability
      });

      return response.status(201).json({ message: "Usuário criado com sucesso!" });
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      return response.status(500).json({ error: "Ocorreu um erro ao criar o usuário." });
    }
  }
};