
exports.up = function(knex, Promise) {
  return knex.schema.table('topics', function (table) {
    table.boolean('isDeleted');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('topics', function (table) {
    table.dropColumn('isDeleted');
  });
};
