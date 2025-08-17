// Migration para a tabela 'topic_replies'

exports.up = function(knex) {
  return knex.schema.createTable('topic_replies', table => {
    table.increments('id').primary();
    
    table.integer('topic_id')
         .notNullable()
         .references('id')
         .inTable('forum_topics')
         .onDelete('CASCADE'); // Se o tópico for deletado, as respostas também são.
         
    table.integer('author_id')
         .notNullable()
         .references('id')
         .inTable('users')
         .onDelete('CASCADE'); // Se o autor for deletado, suas respostas também são.

    table.text('body').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('topic_replies');
};