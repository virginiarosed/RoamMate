-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 02, 2025 at 04:35 PM
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
  `company` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `email`, `password`, `created_at`, `company`) VALUES
(1, 'virginiarosedichoso@gmail.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', '2024-12-21 19:50:05', 'Virginia Dichoso');

-- --------------------------------------------------------

--
-- Table structure for table `itineraries`
--

CREATE TABLE `itineraries` (
  `id` int(11) NOT NULL,
  `destination` varchar(255) DEFAULT NULL,
  `duration_days` int(11) DEFAULT NULL,
  `duration_nights` int(11) DEFAULT NULL,
  `lodging` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `itineraries`
--

INSERT INTO `itineraries` (`id`, `destination`, `duration_days`, `duration_nights`, `lodging`) VALUES
(5, 'Sample 1', 1, 1, 'h'),
(6, 'Sample 2', 1, 0, 'Hotel'),
(7, 'Sample 3', 1, 1, 'H'),
(8, 'Manila', 1, 0, 'N/A');

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

--
-- Dumping data for table `itinerary_days`
--

INSERT INTO `itinerary_days` (`id`, `itinerary_id`, `day_number`, `start_time`, `end_time`, `activity`) VALUES
(64, 5, 1, '00:00:00', '01:00:00', 'Nap'),
(65, 6, 1, '15:14:00', '16:15:00', 'Run'),
(66, 7, 1, '06:56:00', '07:56:00', 'f'),
(67, 8, 1, '06:30:00', '07:00:00', 'Meet Up'),
(68, 8, 1, '07:00:00', '07:30:00', 'Wait for Grab'),
(69, 8, 1, '07:30:00', '09:30:00', 'Travel to Manila Hotel'),
(70, 8, 1, '09:30:00', '10:00:00', 'Travel to San Agustin Museum'),
(71, 8, 1, '10:00:00', '12:00:00', 'San Agustin Museum'),
(72, 8, 1, '12:00:00', '13:00:00', 'Lunch'),
(73, 8, 1, '13:00:00', '13:10:00', 'Travel to Casa Manila'),
(74, 8, 1, '13:10:00', '15:00:00', 'Casa Manila'),
(75, 8, 1, '15:00:00', '15:30:00', 'Travel to National Museum'),
(76, 8, 1, '15:30:00', '18:00:00', 'National Museum');

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
('virginiarosedichoso@gmail.com', '251d324d933935027f8e4144862d3dbf485faa90dc0275ca033a602f70a880b4eed9ee196481ebc1e95cc6025067037e3305', 1734827869),
('virginiarosedichoso@gmail.com', '30ab467e1785098a08438e8fe02aa9ff1a8a0a31e58bc8a798d2875fe81c3196af7ff81d2c6c3e687fdc216c319d09ea94e6', 1734828665),
('virginiarosedichoso@gmail.com', '502f0c093a015be0d7d07ba82a1e27d3631e6a9f014fe264c8e09152229922c509e58ac584fedf4c47a54522a7f525f779eb', 1734822209),
('virginiarosedichoso@gmail.com', '7f08ddb2a868db63b534b6d2cb5f6df08f956d1b717b2a4bebda5b4ddcfae865b2a2b1186bd8e4baf97a57a80b2b6de0a76e', 1734826727),
('virginiarosedichoso@gmail.com', '8e7e76333a0926f908b831ae80ea8ad468d5a8e03128f03fc3a2c049e66c4d9e626cb3b43c427a39b56224ffaa2d17b41415', 1734820636),
('virginiarosedichoso@gmail.com', '9af28bc82baf6a416305adf1464b0dde1dac5c49cbbe935baa43c2ae8c098b7d6ec8436daf1f70cc4e6724b4fd4de4eed134', 1734823550),
('virginiarosedichoso@gmail.com', '9c09644802f1c913d891f1d107fb483ed0a3e0bae5c846f475dbe028d3a83e1ee58b31a15c6ce837736d0164277769f2f736', 1734823287),
('virginiarosedichoso@gmail.com', 'ae151950dbef11ab033dfabb61333ec3150b33570e4a2fdbbc001390a090dcc76e14eb42ae1aa1286b1cdd03b027f800d2a7', 1734827457),
('virginiarosedichoso@gmail.com', 'dc415448df8b8a725633daa9274a51d3133105a22d5e0cd5d10eb180810b909311ffec698eace4ee08b248ac8f7dc6fdf881', 1734823992),
('virginiarosedichoso@gmail.com', 'de8db6f0a37c3747cf25e5ade5931fa25b2160e0591ebe2bec9e68dfbfab4fe6eae49c9390fe5f5e6fcdc3e6697ab09e53ec', 1734828330),
('virginiarosedichoso@gmail.com', 'e26edfdf622cccffd0b3d9fc0752b7d03b761fc9b27faebeec3cbe03b7af03db22d541a120272af646d9e6ad38dda48d12b0', 1734823719);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `itineraries`
--
ALTER TABLE `itineraries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `itinerary_days`
--
ALTER TABLE `itinerary_days`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT for table `requested_itineraries`
--
ALTER TABLE `requested_itineraries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `requested_itinerary_days`
--
ALTER TABLE `requested_itinerary_days`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
