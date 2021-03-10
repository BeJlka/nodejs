const Router = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
// const mySQL = require('mysql');
const connection = require('../connection');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth.middleware');
const refresh = require('../middleware/refresh.middleware');
const { secret, tokens } = require('../config').jwt;

const router = Router();

const generateAccessToken = (id) => {
  const payload = {
    userId: id,
    type: tokens.access.type,
  };
  return jwt.sign(payload, secret, { expiresIn: tokens.access.expiresIn });
};

const generateRefreshToken = (id) => {
  const payload = {
    id: uuidv4(),
    userId: id,
    type: tokens.refresh.type,
  };

  return {
    id: payload.id,
    token: jwt.sign(payload, secret, { expiresIn: tokens.refresh.expiresIn }),
  };
};

//авторизация
router.post('/signin', (req, res) => {
  try {
    const { id, password } = req.body;

    connection.query(
      `SELECT idUser, password, refresh FROM users WHERE idUser = "${id}"`,
      (error, rows, fields) => {
        if (error) {
          return res.status(400).json({ success: false });
        } else if (rows.length <= 0) {
          return res.status(401).json({
            success: false,
            msg: `Пользователь не найден. Пройдите регистрацию.`,
          });
        } else {
          const row = JSON.parse(JSON.stringify(rows));
          const pass = bcrypt.compareSync(password, row[0].password);
          if (pass) {
            const accessToken = generateAccessToken(id);
            const query = `UPDATE users SET token = "${accessToken}" WHERE idUser = "${id}"`;
            connection.query(query, (error, rows) => {
              if (error) {
                return res.status(401).json({
                  success: false,
                  msg: `Неудалось авторизоваться попробуйте еще раз.`,
                });
              } else if (rows) {
                return res.status(200).json({
                  success: true,
                  token: accessToken,
                  refresh: row[0].refresh,
                });
              }
            });
          } else {
            return res
              .status(401)
              .json({ message: `Пароль не верный.`, success: false });
          }
        }
      }
    );
  } catch (error) {}
});

//обновление токена
router.post('/signin/new_token', refresh, (req, res) => {
  // UPDATE `users` SET `idUser` = 'test@mail.ru' WHERE `users`.`id` = 4;

  console.log(req.user);
  try {
    const query = `SELECT * FROM users WHERE idUser = "${req.user.userId}"`;
    connection.query(query, (error, rows, fields) => {
      if (error) {
        return res.status(400).json({ success: false, error });
      } else {
        const row = JSON.parse(JSON.stringify(rows));
        console.log(req.user.userId);
        const accessToken = generateAccessToken(req.user.userId);
        const refreshToken = generateRefreshToken(req.user.userId);
        console.log(refreshToken);
        const sql = `UPDATE users SET token = "${accessToken}", refreshId = "${refreshToken.id}", refresh = "${refreshToken.token}" 
          WHERE users.idUser = "${row[0].idUser}"`;
        // console.log(row[0].idUser);
        connection.query(sql, (error, results) => {
          if (error) {
            return res.status(400).json({
              msg: 'Неудалось обновить токен.',
              success: false,
            });
          } else {
            return res.status(200).json({
              msg: `Токен успешно обновлен.`,
              success: true,
              token: accessToken,
              refresh: refreshToken.token,
            });
          }
        });
      }
    });
  } catch (error) {}
});

//регистрация нового пользователя
router.post('/signup', (req, res) => {
  try {
    const { id, password } = req.body;

    const query = `SELECT * FROM users WHERE idUser = "${id}"`;
    console.log(query);
    connection.query(query, async (error, rows, fields) => {
      if (error) {
        return res.status(400).json({ success: false, error });
      } else if (typeof rows !== 'undefined' && rows.length > 0) {
        return res.status(302).json({
          success: false,
          msg: `Пользователь уже зарегстрирован!`,
        });
      } else {
        const salt = await bcrypt.genSalt(12);
        const accessToken = generateAccessToken(id);
        const refreshToken = generateRefreshToken(id);

        const sql = `INSERT INTO users(idUser, password, token, refreshId, refresh) 
          VALUES("${id}", "${await bcrypt.hash(password, salt)}", 
          "${accessToken}", "${refreshToken.id}", "${refreshToken.token}")`;
        connection.query(sql, (error, results) => {
          if (error) {
            return res.status(400).json({
              msg: 'Неудалось зарегестрировать пользователя.',
              success: false,
            });
          } else {
            return res.status(200).json({
              msg: `Регистрация прошла успешно.`,
              success: true,
              token: accessToken,
              refresh: refreshToken.token,
            });
          }
        });
      }
    });
  } catch (error) {}
});

router.get('/info', auth, (req, res) => {
  return res.json({ success: true, userId: req.user.userId });
});

router.get('/logout', auth, (req, res) => {
  const sql = `UPDATE users SET token = "null" WHERE users.idUser = "${req.user.userId}"`;
  connection.query(sql, (error, rows, fields) => {
    if (error) {
      return res.status(400).json({
        msg: 'Неудалось разлогинить пользователя.',
        success: false,
      });
    } else {
      return res.json({
        msg: 'пользователь успешно разлогинен.',
        success: true,
      });
    }
  });
});

module.exports = router;
