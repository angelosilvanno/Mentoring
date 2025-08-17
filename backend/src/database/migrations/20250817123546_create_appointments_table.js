// Migration para a tabela 'appointments'

exports.up = function(knex) {
  return knex.schema.createTable('appointments', table => {
    table.increments('id').primary();
    
    table.integer('mentor_id')
         .notNullable()
         .references('id')
         .inTable('users')
         .onDelete('CASCADE'); // Se o mentor for deletado, seus agendamentos também são.
         
    table.integer('mentee_id')
         .notNullable()
         .references('id')
         .inTable('users')
         .onDelete('CASCADE'); // Se o mentee for deletado, seus agendamentos também são.

    table.timestamp('appointment_date').notNullable();
    table.text('topic').notNullable();
    table.string('status').notNullable().defaultTo('pendente');
    table.jsonb('feedback'); // Coluna para o objeto de avaliação
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('appointments');
};