exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('username').unique();
    table.string('email').notNullable().unique();
    table.string('password_hash').notNullable();
    table.string('role').notNullable(); 
    table.string('course');
    table.string('gender');
    table.specificType('skills', 'TEXT[]'); 
    table.text('bio');
    table.text('availability');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};