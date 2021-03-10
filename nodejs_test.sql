-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Мар 11 2021 г., 00:43
-- Версия сервера: 10.3.13-MariaDB-log
-- Версия PHP: 7.1.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `nodejs_test`
--

-- --------------------------------------------------------

--
-- Структура таблицы `files`
--

CREATE TABLE `files` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `extension` varchar(255) NOT NULL,
  `mime_type` varchar(255) NOT NULL,
  `size` int(11) NOT NULL,
  `uploadDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `files`
--

INSERT INTO `files` (`id`, `name`, `extension`, `mime_type`, `size`, `uploadDate`) VALUES
(21, 'km3yxbac_unknown.png', 'png', 'image/png', 109855, '2021-03-10 21:42:33'),
(22, 'km3yxcb1_unknown.png', 'png', 'image/png', 109855, '2021-03-10 21:42:34'),
(23, 'km3yxd98_unknown.png', 'png', 'image/png', 109855, '2021-03-10 21:42:35'),
(24, 'km3yxdwf_unknown.png', 'png', 'image/png', 109855, '2021-03-10 21:42:36'),
(25, 'km3yxeh5_unknown.png', 'png', 'image/png', 109855, '2021-03-10 21:42:37'),
(26, 'km3yxeyk_unknown.png', 'png', 'image/png', 109855, '2021-03-10 21:42:37'),
(27, 'km3yxfg3_unknown.png', 'png', 'image/png', 109855, '2021-03-10 21:42:38'),
(28, 'km3yxfy0_unknown.png', 'png', 'image/png', 109855, '2021-03-10 21:42:39'),
(29, 'km3yxgfk_unknown.png', 'png', 'image/png', 109855, '2021-03-10 21:42:39'),
(30, 'km3yxgxm_unknown.png', 'png', 'image/png', 109855, '2021-03-10 21:42:40'),
(31, 'km3yxhg2_unknown.png', 'png', 'image/png', 109855, '2021-03-10 21:42:41'),
(32, 'km3yxhvt_unknown.png', 'png', 'image/png', 109855, '2021-03-10 21:42:41'),
(33, 'km3yxibs_unknown.png', 'png', 'image/png', 109855, '2021-03-10 21:42:42'),
(34, 'km3yxis6_unknown.png', 'png', 'image/png', 109855, '2021-03-10 21:42:42'),
(35, 'km3yxj98_unknown.png', 'png', 'image/png', 109855, '2021-03-10 21:42:43'),
(36, 'km3yxjqv_unknown.png', 'png', 'image/png', 109855, '2021-03-10 21:42:44'),
(37, 'km3yxk9w_unknown.png', 'png', 'image/png', 109855, '2021-03-10 21:42:44');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `idUser` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `refreshId` varchar(255) NOT NULL,
  `refresh` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `idUser`, `password`, `token`, `refreshId`, `refresh`) VALUES
(6, 'test@mail.cm', '$2b$12$2SiIgc.I8oly1H9YdToSWei5jjqVkClNnWXlpR4EAc3M0k8uCcMlG', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0QG1haWwuY20iLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNjE1NDEyNTQxLCJleHAiOjE2MTU0MTMxNDF9.NN2NnEJ_ozYjkHKpXJ0EEnLJYQxZ2Q_EBGvkDOBEBqI', '2b482077-9e92-48f6-9989-359a53e256ab', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJiNDgyMDc3LTllOTItNDhmNi05OTg5LTM1OWE1M2UyNTZhYiIsInVzZXJJZCI6InRlc3RAbWFpbC5jbSIsInR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNjE1NDEyNDExLCJleHAiOjE2MTU0OTg4MTF9.-FtELEWx3O6dSq83Hkw7hwXjApiM0HxU2ZgBSA-0Drc'),
(7, 'test@mail.ru', '$2b$12$mGtPUtpsaPbWYIoJziQZwe.lx.19MBrEnkgeAW950IOr5Iif65Ybq', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3RAbWFpbC5ydSIsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE2MTUzOTA0MTQsImV4cCI6MTYxNTM5MTAxNH0.oczoKykFzWyEM6UWfZV9bDzQTWpgmzM890C5rmBgf9k', '2575db06-b90a-483b-b7ca-7041bce22148', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI0MGQ0YjQ1LWQyYmQtNDljOC1hOWYxLTc5ZWM2MDg2MzhkNyIsInVzZXJJZCI6InRlc3RAbWFpbC5ydSIsInR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNjE1MzkwNTY5LCJleHAiOjE2MTU0NzY5Njl9.WXIjzed3RnRT6eqmtPlz_DzRNdrMk2K_hnVwRRtTrR4');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idUser` (`idUser`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `files`
--
ALTER TABLE `files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
