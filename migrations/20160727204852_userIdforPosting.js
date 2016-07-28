
exports.up = function(knex, Promise) {
  return knex.schema.table('topics', function (table) {
    table.dropColumn('name');
    table.integer('postedBy');
  })
};

exports.down = function(knex, Promise) {
  table.string('name');
  table.dropColumn('postedBy');
};
