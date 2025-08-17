// src/routes/routes.js

const express = require('express');
const UserController = require('../controllers/UserController');
const SessionController = require('../controllers/SessionController');
const AppointmentController = require('../controllers/AppointmentController');
const ForumController = require('../controllers/ForumController');

const routes = express.Router();

// --- Rotas de Autenticação e Usuários ---
routes.post('/login', SessionController.create);
routes.get('/users', UserController.index);
routes.post('/users', UserController.create);
// Adicionar rotas para /users/:id (PATCH para editar, DELETE para remover)

// --- Rotas de Agendamentos ---
routes.get('/appointments', AppointmentController.index);      // Buscar agendamentos de um usuário
routes.post('/appointments', AppointmentController.create);     // Criar novo agendamento
routes.patch('/appointments/:id', AppointmentController.update);  // Atualizar (status, data, feedback)
routes.delete('/appointments/:id', AppointmentController.delete); // Cancelar/Excluir

// --- Rotas do Fórum ---
routes.get('/forum', ForumController.indexTopics);           // Listar todos os tópicos
routes.post('/forum', ForumController.createTopic);          // Criar novo tópico
routes.get('/forum/:id', ForumController.showTopic);         // Ver um tópico e suas respostas
routes.post('/forum/:id/replies', ForumController.createReply); // Adicionar uma resposta

module.exports = routes;