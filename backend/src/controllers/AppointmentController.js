const connection = require('../database/connection');

module.exports = {
  // Listar agendamentos (para um usuário específico)
  async index(request, response) {
    const { user_id } = request.query; // Ex: /appointments?user_id=123

    if (!user_id) {
      return response.status(400).json({ error: 'ID do usuário é obrigatório.' });
    }

    try {
      const appointments = await connection('appointments')
        .where('mentor_id', user_id)
        .orWhere('mentee_id', user_id)
        .select('*');
      
      return response.json(appointments);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      return response.status(500).json({ error: "Ocorreu um erro interno." });
    }
  },

  // Criar um novo agendamento
  async create(request, response) {
    const { mentor_id, mentee_id, appointment_date, topic } = request.body;

    try {
      const [appointment] = await connection('appointments').insert({
        mentor_id,
        mentee_id,
        appointment_date,
        topic,
        status: 'pendente'
      }).returning('*');

      return response.status(201).json(appointment);
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      return response.status(500).json({ error: "Ocorreu um erro ao criar o agendamento." });
    }
  },

  // Atualizar um agendamento (mudar status, data, feedback, etc.)
  async update(request, response) {
    const { id } = request.params;
    const changes = request.body;

    try {
      const count = await connection('appointments').where('id', id).update(changes);
      if (count === 0) {
        return response.status(404).json({ error: 'Agendamento não encontrado.' });
      }
      const updatedAppointment = await connection('appointments').where('id', id).first();
      return response.status(200).json(updatedAppointment);
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
      return response.status(500).json({ error: "Ocorreu um erro ao atualizar o agendamento." });
    }
  },

  // Deletar um agendamento
  async delete(request, response) {
    const { id } = request.params;

    try {
      const count = await connection('appointments').where('id', id).delete();
      if (count === 0) {
        return response.status(404).json({ error: 'Agendamento não encontrado.' });
      }
      return response.status(204).send(); // 204 No Content
    } catch (error) {
      console.error("Erro ao deletar agendamento:", error);
      return response.status(500).json({ error: "Ocorreu um erro ao deletar o agendamento." });
    }
  }
};