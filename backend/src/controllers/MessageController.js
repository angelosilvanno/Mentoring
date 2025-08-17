// src/controllers/MessageController.js
const connection = require('../database/connection');

module.exports = {
  async index(request, response) {
    const { user_id } = request.query;
    try {
      const messages = await connection('messages')
        .where('sender_id', user_id)
        .orWhere('receiver_id', user_id)
        .orderBy('created_at', 'desc');
      return response.json(messages);
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao buscar mensagens.' });
    }
  },

  async create(request, response) {
    const { sender_id, receiver_id, subject, body } = request.body;
    try {
      const [message] = await connection('messages').insert({
        sender_id,
        receiver_id,
        subject,
        body
      }).returning('*');
      return response.status(201).json(message);
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao criar mensagem.' });
    }
  }
};