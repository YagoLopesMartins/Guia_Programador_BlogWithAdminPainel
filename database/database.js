const Sequelize = require("sequelize")

// Option 3: Passing parameters separately (other dialects)
const connection = new Sequelize('blog', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',/* one of  | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
    timezone: "-03:00",
    logging: false
});

module.exports = connection