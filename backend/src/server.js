// src/server.js

const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes'); // Importa nosso arquivo de rotas

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes); // Diz ao Express para usar as rotas que definimos

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});