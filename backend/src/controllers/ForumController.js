// src/controllers/ForumController.js
const connection = require('../database/connection');

module.exports = {
  // Listar todos os tópicos
  async indexTopics(request, response) {
    try {
      const topics = await connection('forum_topics')
        .join('users', 'users.id', '=', 'forum_topics.author_id')
        .select('forum_topics.*', 'users.name as author_name')
        .orderBy('created_at', 'desc');
      
      return response.json(topics);
    } catch (error) {
      return response.status(500).json({ error: "Erro ao buscar tópicos." });
    }
  },

  // Criar um novo tópico
  async createTopic(request, response) {
    const { author_id, title, body } = request.body;
    try {
      const [topic] = await connection('forum_topics').insert({ author_id, title, body }).returning('*');
      return response.status(201).json(topic);
    } catch (error) {
      return response.status(500).json({ error: "Erro ao criar o tópico." });
    }
  },

  // Mostrar um tópico específico com suas respostas
  async showTopic(request, response) {
    const { id } = request.params;
    try {
      const topic = await connection('forum_topics').where('id', id).first();
      if (!topic) {
        return response.status(404).json({ error: 'Tópico não encontrado.' });
      }
      
      const replies = await connection('topic_replies')
        .where('topic_id', id)
        .join('users', 'users.id', '=', 'topic_replies.author_id')
        .select('topic_replies.*', 'users.name as author_name')
        .orderBy('created_at', 'asc');

      return response.json({ ...topic, replies });
    } catch (error) {
      return response.status(500).json({ error: "Erro ao buscar tópico." });
    }
  },

  // Criar uma nova resposta para um tópico
  async createReply(request, response) {
    const { id: topic_id } = request.params;
    const { author_id, body } = request.body;
    try {
      const [reply] = await connection('topic_replies').insert({ topic_id, author_id, body }).returning('*');
      return response.status(201).json(reply);
    } catch (error) {
      return response.status(500).json({ error: "Erro ao criar a resposta." });
    }
  }
};