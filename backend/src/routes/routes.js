// src/routes/routes.js

const express = require('express');
const UserController = require('../controllers/UserController');
const SessionController = require('../controllers/SessionController');
const AppointmentController = require('../controllers/AppointmentController');
const ForumController = require('../controllers/ForumController');
const MessageController = require('../controllers/MessageController');

const routes = express.Router();

// --- Rotas de Autenticação e Usuários ---
routes.post('/login', SessionController.create);
routes.get('/users', UserController.index);
routes.post('/users', UserController.create);


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

// --- Rotas de Mensagens ---
routes.get('/messages', MessageController.index);
routes.post('/messages', MessageController.create);


module.exports = routes;