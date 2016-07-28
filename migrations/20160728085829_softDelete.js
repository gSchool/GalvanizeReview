
exports.up = function(knex, Promise) {
  return knex.schema.table('topics', function (table) {
    table.boolean('isDeleted').defaultTo(false) ;
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('topics', function (table) {
    table.dropColumn('isDeleted');
  });
};
