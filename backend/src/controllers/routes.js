// src/routes/routes.js

const express = require('express');
const UserController = require('../controllers/UserController');
const SessionController = require('../controllers/SessionController');

const routes = express.Router();

// Rota de Login
routes.post('/login', SessionController.create);

// Rotas de Usuários
routes.get('/users', UserController.index);   // Listar todos os usuários
routes.post('/users', UserController.create);  // Criar um novo usuário (cadastro)

module.exports = routes;