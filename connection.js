const mySQL = require('mysql');

const connection = mySQL.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'nodejs_test',
});

connection.connect((err) => {
  if (err) {
    console.error('Ошибка подключения: ' + err);
    return;
  }
  console.log('База успешно подключенна.');
});

module.exports = connection;
