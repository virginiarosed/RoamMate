-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 28, 2025 at 04:22 AM
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
-- Database: `roammate_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` char(64) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `failed_attempts` int(11) DEFAULT 0,
  `last_failed_attempt` datetime DEFAULT NULL,
  `lockout_expiry` datetime DEFAULT NULL,
  `company_code` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `email`, `password`, `created_at`, `failed_attempts`, `last_failed_attempt`, `lockout_expiry`, `company_code`) VALUES
(1, 'harrypotter@gmail.com', '$2y$10$06Wsk6qxBSNkS4GXRfhAguQskSsCKUVlma06XRH2XtxX0oEpRr9ve', '2025-01-22 20:30:59', 0, '2025-01-27 02:53:49', NULL, '4B-TRVL-ND-TRS'),
(18, 'virginiarosedichoso@gmail.com', '$2y$10$73qgIJ4zV9dbUphbbEDya.LrwNirj9zAslHnJ43UnUQM6vN0TyecO', '2025-01-27 23:47:49', 0, NULL, NULL, '4B-TRVL-ND-TRS'),
(19, 'anna@gmail.com', '$2y$10$JdBLwpFhJyGxDxKCYdPTruPtgcQ6yRB3D1DBKOR1fsij7c/9z9hvC', '2025-01-27 23:52:26', 0, NULL, NULL, '4B-TRVL-ND-TRS'),
(20, 'merida@gmail.com', '$2y$10$iRyiWVHVam/.TnS4eg.5r.hQ.CrHgAOgL9Fqm6i053dn6rZt54dJO', '2025-01-28 00:05:04', 0, NULL, NULL, '4B-TRVL-ND-TRS');

-- --------------------------------------------------------

--
-- Table structure for table `itineraries`
--

CREATE TABLE `itineraries` (
  `id` int(11) NOT NULL,
  `destination` varchar(255) DEFAULT NULL,
  `duration_days` int(11) DEFAULT NULL,
  `duration_nights` int(11) DEFAULT NULL,
  `lodging` text DEFAULT NULL,
  `formatted_duration` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `itinerary_days`
--

CREATE TABLE `itinerary_days` (
  `id` int(11) NOT NULL,
  `itinerary_id` int(11) NOT NULL,
  `day_number` int(11) NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `activity` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `password_resets`
--

INSERT INTO `password_resets` (`email`, `token`, `expires`) VALUES
('virginiarosedichoso@gmail.com', '1b003c9d0a40dfc0dababd576e91162ba4c747e00c2bb210396e54eadf9228184df74addbe0b318263d62ee0b7e03e5aa6f2', 1738038075);

-- --------------------------------------------------------

--
-- Table structure for table `requested_itineraries`
--

CREATE TABLE `requested_itineraries` (
  `id` int(11) NOT NULL,
  `client_name` varchar(255) NOT NULL,
  `destination` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `lodging` text NOT NULL,
  `duration` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `formatted_duration` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `requested_itineraries`
--

INSERT INTO `requested_itineraries` (`id`, `client_name`, `destination`, `start_date`, `end_date`, `lodging`, `duration`, `created_at`, `formatted_duration`) VALUES
(1, 'Harry Potter', 'Bicol', '2025-01-28', '2025-01-28', 'Hotel', 1, '2025-01-27 20:58:49', 'Roundtrip');

-- --------------------------------------------------------

--
-- Table structure for table `requested_itinerary_days`
--

CREATE TABLE `requested_itinerary_days` (
  `id` int(11) NOT NULL,
  `itinerary_id` int(11) NOT NULL,
  `day_number` int(11) NOT NULL,
  `date` date NOT NULL,
  `day` varchar(20) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `activity` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `requested_itinerary_days`
--

INSERT INTO `requested_itinerary_days` (`id`, `itinerary_id`, `day_number`, `date`, `day`, `start_time`, `end_time`, `activity`) VALUES
(1, 1, 1, '2025-01-28', 'Tuesday', '04:58:00', '04:58:00', 'Run');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `itineraries`
--
ALTER TABLE `itineraries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `itinerary_days`
--
ALTER TABLE `itinerary_days`
  ADD PRIMARY KEY (`id`),
  ADD KEY `itinerary_id` (`itinerary_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`token`);

--
-- Indexes for table `requested_itineraries`
--
ALTER TABLE `requested_itineraries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `requested_itinerary_days`
--
ALTER TABLE `requested_itinerary_days`
  ADD PRIMARY KEY (`id`),
  ADD KEY `itinerary_id` (`itinerary_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `itineraries`
--
ALTER TABLE `itineraries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `itinerary_days`
--
ALTER TABLE `itinerary_days`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `requested_itineraries`
--
ALTER TABLE `requested_itineraries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `requested_itinerary_days`
--
ALTER TABLE `requested_itinerary_days`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `itinerary_days`
--
ALTER TABLE `itinerary_days`
  ADD CONSTRAINT `itinerary_days_ibfk_1` FOREIGN KEY (`itinerary_id`) REFERENCES `itineraries` (`id`);

--
-- Constraints for table `requested_itinerary_days`
--
ALTER TABLE `requested_itinerary_days`
  ADD CONSTRAINT `requested_itinerary_days_ibfk_1` FOREIGN KEY (`itinerary_id`) REFERENCES `requested_itineraries` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
