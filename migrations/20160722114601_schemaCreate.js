
exports.up = function(knex, Promise) {
  return knex.schema.createTable('topics', function(table) {
  table.increments();
  table.string('title');
  table.string('name');
  table.string('description');
  table.integer('score');
  table.string('comments');
  table.boolean('isActive');
});
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('topics');
};
