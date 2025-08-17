// src/database/connection.js

const knex = require('knex');
const configuration = require('../../knexfile'); // Importa as configs do knexfile

// Seleciona a configuração de 'development' do nosso knexfile.js
const connection = knex(configuration.development);

module.exports = connection; // Exporta a conexão para ser usada em outros arquivos