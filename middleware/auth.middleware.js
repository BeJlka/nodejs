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
      return res.status(401).json({ msg: 'Пользователь не авторизованн' });
    }

    const decoded = jwt.verify(token, secret);
    if (decoded.type !== 'access') {
      return res.json({ msg: 'Токен не действителен' });
    }

    console.log(decoded);
    connection.query(
      `SELECT * FROM users WHERE idUser="${decoded.userId}"`,
      (error, rows) => {
        if (error) {
          return res.status(401).json({ msg: 'Пользователь не авторизованн' });
        } else if (rows !== undefined) {
          const row = JSON.parse(JSON.stringify(rows))[0];
          console.log(row);
          if (row.token !== 'null') {
            console.log(row.token);
            req.user = decoded;
            next();
          } else {
            return res
              .status(401)
              .json({ msg: 'Пользователь не авторизованн' });
          }
        } else {
          return res.status(401).json({ msg: 'Пользователь не авторизованн' });
        }
      }
    );
  } catch (error) {
    return res.status(401).json({ msg: 'Пользователь не авторизованн' });
  }
};
