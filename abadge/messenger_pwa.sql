-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 25, 2026 at 04:25 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `messenger_pwa`
--

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `message`, `is_read`, `created_at`) VALUES
(1, 1, 2, 'sdfsdfsd', 0, '2026-06-24 14:09:32'),
(2, 1, 2, 'vvvvvvvvv', 0, '2026-06-24 14:10:16'),
(3, 2, 1, 'fgdfg', 1, '2026-06-24 14:11:03'),
(4, 3, 4, 'aaaaaaaa', 0, '2026-06-24 14:12:29'),
(5, 4, 3, 'gggggg', 1, '2026-06-24 14:12:44'),
(6, 4, 3, 'gfghg', 1, '2026-06-24 14:13:24'),
(7, 4, 3, 'ttttt', 1, '2026-06-24 14:17:14'),
(8, 4, 3, 'erwere', 1, '2026-06-24 14:18:17'),
(9, 4, 3, 'dsfsfds', 1, '2026-06-24 14:19:48'),
(10, 3, 4, 'wweqe', 0, '2026-06-24 14:20:49'),
(11, 4, 3, 'dfsdfsd', 1, '2026-06-24 14:27:40'),
(12, 4, 3, 'fdgdfgdf', 1, '2026-06-24 14:29:39'),
(13, 3, 4, 'dfsdfsd', 0, '2026-06-24 14:29:53'),
(14, 4, 3, 'fgdfgdf', 1, '2026-06-24 14:30:33'),
(15, 4, 3, 'dsfsdf', 1, '2026-06-24 14:38:26'),
(16, 3, 4, 'adsad', 0, '2026-06-24 14:38:49'),
(17, 4, 3, 'wwwwwwwwww', 1, '2026-06-24 14:39:00'),
(18, 3, 4, 'ffffff', 0, '2026-06-24 14:40:59');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `created_at`) VALUES
(1, 'aaa', '2026-06-24 14:09:32'),
(2, 'bbb', '2026-06-24 14:09:32'),
(3, 'alice', '2026-06-24 14:12:29'),
(4, 'bob', '2026-06-24 14:12:29');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
