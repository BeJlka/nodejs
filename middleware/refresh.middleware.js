const jwt = require('jsonwebtoken');
const { secret } = require('../config').jwt;
const connection = require('../connection');

module.exports = (req, res, next) => {
  //проверка доступен ли сервер
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ msg: 'Токен не действителен' });
    }

    const decoded = jwt.verify(token, secret);
    if (decoded.type !== 'refresh') {
      return res.json({ msg: 'Токен не действителен' });
    }

    connection.query(
      `SELECT * FROM users WHERE idUser="${decoded.userId}"`,
      (error, rows) => {
        if (error) {
          return res.status(401).json({ msg: 'Токен не действителен' });
        } else if (rows !== undefined) {
          const row = JSON.parse(JSON.stringify(rows))[0];
          console.log(row);
          if (row.refresh !== 'null' && row.refresh === token) {
            console.log(row.refresh);
            req.user = decoded;
            next();
          } else {
            return res.status(401).json({ msg: 'Токен не действителен' });
          }
        } else {
          return res.status(401).json({ msg: 'Токен не действителен' });
        }
      }
    );
  } catch (error) {
    return res.status(401).json({ msg: 'Токен не действителен' });
  }
};
