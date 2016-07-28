
exports.up = function(knex, Promise) {
  return knex.schema.table('topics', function (table) {
    table.timestamps(true,true);
  })
  .table('users', function(table) {
    table.timestamps(true,true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('topics', function (table) {
    table.dropTimestamps();
  })
  .table('users', function(table) {
    table.dropTimestamps();
  });
};
