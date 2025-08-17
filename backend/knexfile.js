module.exports = {
  development: {
    client: 'pg', 
    connection: {
      host: '127.0.0.1', 
      user: 'seu_usuario_aqui',      
      password: 'sua_senha_aqui', 
      database: 'mentoring_db' 
    },
    migrations: {
      directory: './src/database/migrations' 
    }
  }
};