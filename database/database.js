const Sequelize = require('sequelize');

const connection = new Sequelize('heroku_cd2ab5ac821a04f', 'b96e23458dd972', '62d63a00', {
    host: 'us-cdbr-east-05.cleardb.net',
    dialect: 'mysql'
});

module.exports = connection;