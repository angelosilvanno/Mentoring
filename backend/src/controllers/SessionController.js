// src/controllers/SessionController.js

const connection = require('../database/connection');
const bcrypt = require('bcrypt');

module.exports = {
  // Função para criar uma sessão (Login)
  async create(request, response) {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({ error: "E-mail e senha são obrigatórios." });
    }

    try {
      // Busca o usuário pelo e-mail
      const user = await connection('users').where('email', email).first();

      if (!user) {
        return response.status(401).json({ error: "E-mail ou senha inválidos." }); // 401 Unauthorized
      }

      // Compara a senha digitada com o hash salvo no banco
      const isPasswordMatch = await bcrypt.compare(password, user.password_hash);

      if (!isPasswordMatch) {
        return response.status(401).json({ error: "E-mail ou senha inválidos." });
      }
      
      // Se tudo estiver certo, retorna os dados do usuário (sem a senha)
      const { password_hash, ...userWithoutPassword } = user;

      return response.json(userWithoutPassword);

    } catch (error) {
      console.error("Erro no login:", error);
      return response.status(500).json({ error: "Ocorreu um erro interno no servidor." });
    }
  }
};