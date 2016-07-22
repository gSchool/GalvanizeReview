module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/GalvanizeReview'
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }

};
