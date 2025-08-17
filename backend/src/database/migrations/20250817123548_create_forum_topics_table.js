// Migration para a tabela 'forum_topics'

exports.up = function(knex) {
  return knex.schema.createTable('forum_topics', table => {
    table.increments('id').primary();
    
    table.integer('author_id')
         .notNullable()
         .references('id')
         .inTable('users')
         .onDelete('CASCADE'); // Se o autor for deletado, seus tópicos também são.

    table.string('title').notNullable();
    table.text('body').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('forum_topics');
};