
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
  table.increments();
  table.string('xid');
  table.string('xprovider');
  table.string('username')
  table.string('displayName');
  table.string('avatarUrl');
  table.string('profileUrl');
  table.boolean('isAdmin');
});
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('topics');
};
