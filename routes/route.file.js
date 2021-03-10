const Router = require('express');
const multer = require('multer');
const fs = require('fs');
const connection = require('../connection');
const auth = require('../middleware/auth.middleware');

const { UPLOADS } = require('../config');

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: async (req, file, cb) => {
    const fileName = Date.now().toString(36) + '_' + file.originalname;
    cb(null, fileName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1000 * 1024 },
}).single('file');

//добавление нового файла
router.post('/file/upload', auth, async (req, res) => {
  try {
    let date = new Date();
    let options = {
      timeZone: 'UTC',
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    date = date.toLocaleString('en-US', options);
    let array = date.split(',');
    let dateStr = array.shift().split('/');
    date = `${dateStr[2]}/${dateStr[0]}/${dateStr[1]} ${array}`;

    upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          msg: 'Не удалось сохранить файл. Попробуйте еще раз',
        });
      }
      const query = `INSERT INTO files(name, extension, mime_type, size, uploadDate) 
      VALUES("${req.file.filename}", "${
        req.file.originalname.split('.')[1]
      }", "${req.file.mimetype}", "${req.file.size}", "${date}")`;
      connection.query(query, (error, rows, fields) => {
        if (error) {
          console.log(error);
          return res
            .status(400)
            .json({ success: false, msg: 'Неудалось сохранить файл в базе' });
        } else {
          return res.json({
            success: true,
            msg: 'Файл сохраненна',
            path: UPLOADS + '/' + req.file.filename,
          });
        }
      });
    });
  } catch (error) {}
});
//вывод списка файлов
router.get('/file/list', auth, (req, res) => {
  const page = req.query.page > 0 ? req.query.page : 1;
  const listSize = req.query.list_size > 0 ? req.query.list_size : 10;
  // SELECT * FROM wp_posts ORDER BY ID DESC LIMIT ' + limit
  const limit = `${(page - 1) * listSize}, ${listSize}`;
  connection.query(
    `SELECT * FROM files LIMIT ${limit}`,
    (error, rows, fields) => {
      if (error) {
        return res
          .status(400)
          .json({ success: false, msg: 'Неудалось получить файлы' });
      } else if (rows !== undefined) {
        const array = JSON.parse(JSON.stringify(rows));
        return res.json({ success: true, files: array });
      }
    }
  );
});

//удаление файла
router.delete('/file/delete/:id', auth, (req, res) => {
  connection.query(
    `SELECT * FROM files WHERE files.id = "${req.params.id}"`,
    (error, rows, fields) => {
      if (typeof rows !== 'undefined' && rows.length > 0) {
        const delFile = JSON.parse(JSON.stringify(rows))[0];
        const query = `DELETE FROM files WHERE files.id = "${req.params.id}"`;
        connection.query(query, (error, rows, fields) => {
          if (error) {
            return res
              .status(400)
              .json({ success: false, msg: 'Неудалось удалить файл' });
          } else {
            fs.unlinkSync(`${__dirname}/../uploads/${delFile.name}`);
            return res
              .status(200)
              .json({ success: true, msg: 'Файл успешно удален.' });
          }
        });
      }
    }
  );
});

//вывод информации о файле
router.get('/file/:id', auth, (req, res) => {
  // SELECT * FROM `files` WHERE `files`.`id` = req.params.id
  connection.query(
    `SELECT * FROM files WHERE files.id = "${req.params.id}"`,
    (error, rows, fields) => {
      if (error) {
        return res.json({
          success: false,
          msg: 'Не удалось получить информацию о файле. Попробуйте еще раз',
        });
      } else if (typeof rows !== 'undefined' && rows.length > 0) {
        const row = JSON.parse(JSON.stringify(rows))[0];
        console.log(row);
        return res.json({
          success: true,
          file: { ...row },
        });
      }
    }
  );
});

//скачивание файла
router.get('/file/download/:id', auth, (req, res) => {
  connection.query(
    `SELECT * FROM files WHERE files.id = "${req.params.id}"`,
    (error, rows, fields) => {
      if (error) {
        return res.json({
          success: false,
          msg: 'Не удалось загрузить файл. Попробуйте еще раз',
        });
      } else if (typeof rows !== 'undefined' && rows.length > 0) {
        const row = JSON.parse(JSON.stringify(rows))[0];
        const file = `${__dirname}/../${UPLOADS}/${row.name}`;
        res.download(file);
      }
    }
  );
});

//обновление файла
router.put('/file/update/:id', auth, (req, res) => {
  console.log(req.params.userId);
  connection.query(
    `SELECT * FROM files WHERE files.id = "${req.params.id}"`,
    (error, rows, fields) => {
      if (error) {
        return res.json({
          success: false,
          msg: 'Не удалось загрузить файл. Попробуйте еще раз',
        });
      } else if (typeof rows !== 'undefined' && rows.length > 0) {
        const delFile = JSON.parse(JSON.stringify(rows))[0];
        upload(req, res, (err) => {
          if (err) {
            return res.status(400).json({
              success: false,
              msg: 'Не удалось обновить файл. Попробуйте еще раз',
            });
          }
          console.log(req.file);
          connection.query(
            `UPDATE files SET 
            name = "${req.file.filename}", 
            extension = "${req.file.originalname.split('.')[1]}",
             mime_type = "${req.file.mimetype}", 
             size = "${req.file.size}" 
             WHERE files.id = "${req.params.id}"`,
            (error, rows, fields) => {
              if (error) {
              } else {
                fs.unlinkSync(`${__dirname}/../uploads/${delFile.name}`);
                return res.json({
                  success: true,
                  msg: 'Файл изменен',
                  path: UPLOADS + '/' + req.file.filename,
                });
              }
            }
          );
        });
      }
    }
  );
});

module.exports = router;
