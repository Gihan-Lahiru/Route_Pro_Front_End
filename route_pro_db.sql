-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 13, 2025 at 09:38 AM
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
-- Database: `route_pro_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `department` varchar(100) NOT NULL,
  `permissions` varchar(100) DEFAULT 'basic',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admin_action`
--

CREATE TABLE `admin_action` (
  `action_id` int(11) NOT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `target_user_id` int(11) DEFAULT NULL,
  `action_type` enum('warned','banned','reactivated') DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `action_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attraction_place`
--

CREATE TABLE `attraction_place` (
  `id` int(11) NOT NULL,
  `traveler_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `lat` double DEFAULT NULL,
  `lng` double DEFAULT NULL,
  `saved_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `booking_id` int(11) NOT NULL,
  `traveler_id` int(11) DEFAULT NULL,
  `driver_id` int(11) DEFAULT NULL,
  `guide_id` int(11) DEFAULT NULL,
  `route_id` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `total_cost` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','confirmed','cancelled','completed') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `drivers`
--

CREATE TABLE `drivers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `status` enum('available','nonavailable') NOT NULL DEFAULT 'nonavailable',
  `license_no` varchar(50) NOT NULL,
  `vehicle_type` varchar(50) NOT NULL,
  `experience` int(11) NOT NULL,
  `location` varchar(100) NOT NULL,
  `photo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `drivers`
--

INSERT INTO `drivers` (`id`, `user_id`, `name`, `phone`, `status`, `license_no`, `vehicle_type`, `experience`, `location`, `photo`) VALUES
(2, 12, 'kumara', '0776517590', 'nonavailable', 'B231232', 'car', 5, 'Galle', NULL),
(3, 13, 'guhan', '123456789', 'nonavailable', 'B231232@', 'car', 1, 'Galle', NULL),
(4, 14, 'pubudu', '0776517590', 'nonavailable', 'DU1234', 'bike', 2, 'jaffna', NULL),
(5, 15, 'kalana', '0776517590', 'nonavailable', 'BD1234', 'car', 5, 'jaffna', NULL),
(6, 16, 'dd', '0123456789', 'nonavailable', 'BD1234', 'car', 5, 'jaffna', NULL),
(7, 17, 'sa', '0123456789', 'nonavailable', 'BS1234', 'car', 2, 'c', NULL),
(8, 18, 'd', '0123456789', 'nonavailable', 'BD1234', 'car', 5, '@', NULL),
(9, 19, 'lasith', '0123456789', 'nonavailable', 'BG1234', 'car', 1, 'galle', NULL),
(10, 20, 'omal', '0123456789', 'nonavailable', 'BG1234', 'car', 1, 'galle', NULL),
(11, 21, 'omall', '0123456789', 'nonavailable', 'BG1234', 'minicar', 1, 'galle', NULL),
(12, 22, 'kalaum', '0723456789', 'nonavailable', 'BG1234', 'car', 1, 'galle', NULL),
(13, 23, 'nisal', '0723456789', 'nonavailable', 'BG1234', 'tuk', 1, 'galle', NULL),
(14, 24, 'driver', '0723456789', 'nonavailable', 'BG1234', 'car', 1, 'galle', NULL),
(15, 25, '@', '0776', 'nonavailable', '@@', 'car', 1, 'galle', NULL),
(16, 26, 'driver', '0723456789', 'nonavailable', 'BG1234', 'car', 1, 'galle', NULL),
(17, 27, 'Bimsara', '0776517595', 'nonavailable', '1221', 'minicar', 2, 'jaffna', NULL),
(18, 29, 'hansaka kavinda', '0776517595', 'nonavailable', '12345678', 'car', 5, 'matara', NULL),
(19, 30, 'laal', '0776517595', 'nonavailable', '12345678', 'car', 5, 'matara', NULL),
(20, 31, 'Ananda Kumara', '0712409293', 'nonavailable', 'AB12345', 'car', 5, 'Rathnapura', NULL),
(21, 32, '', '0723456789', 'nonavailable', '', '', 4, 'galle', NULL),
(22, 33, '', '0723456789', 'nonavailable', '', '', 4, 'galle', NULL),
(23, 34, '', '0700000000', 'nonavailable', '', '', 4, 'galle', NULL),
(24, 45, 'Wasantha Mahima', '0712409293', 'nonavailable', 'AB12345', 'tuk', 1, 'colombo', NULL),
(25, 62, 'praneeth kariyawasam', '0776517590', 'available', '', 'van', 5, 'galle', '/RoutePro-backend(02)/public/uploads/drivers/driver_62_1756447966.jpg'),
(26, 63, 'lasith', '0776517484', 'nonavailable', 'DRIVER34567', 'bike', 4, 'matara', NULL),
(27, 64, 'kalana pradeepa', '0776524567', 'nonavailable', 'DRIVER12345', 'car', 4, 'Galle', NULL),
(28, 65, 'kalama', '0776524567', 'nonavailable', 'DRIVER12345', 'car', 4, 'Galle', NULL),
(29, 66, 'kalama', '0776524567', 'nonavailable', 'DRIVER12345', 'minicar', 4, 'Galle', NULL),
(30, 67, 'Test Driver', '0712345678', 'nonavailable', 'DL123456', 'car', 5, 'Colombo', NULL),
(31, 68, 'Test Driver', '0712345678', 'nonavailable', 'DL123456', 'car', 5, 'Colombo', NULL),
(32, 69, 'kalama', '0776524567', 'nonavailable', 'DRIVER12345', 'minicar', 2, 'Galle', NULL),
(33, 70, 'Test Driver', '0771234567', 'nonavailable', 'ABC123', 'car', 3, 'Colombo', NULL),
(34, 71, 'kalama', '0776524567', 'nonavailable', 'DRIVER12345', 'car', 2, 'Galle', NULL),
(35, 72, 'kala', '0776524567', 'nonavailable', 'DRIVER12345', 'tuk', 2, 'Galle', NULL),
(36, 73, 'kala', '0776524567', 'nonavailable', 'DRIVER12345', 'car', 2, 'Galle', NULL),
(37, 89, 'kala', '0776524567', 'nonavailable', 'DRIVER12345', 'van', 2, 'Galle', NULL),
(38, 90, 'kala', '0776524567', 'nonavailable', 'DRIVER12345', 'car', 2, 'Galle', NULL),
(39, 91, 'dri', '0776517595', 'nonavailable', 'DRIVER12345', 'car', 2, 'Galle', NULL),
(40, 93, 'dri', '0776517595', 'nonavailable', 'DRIVER12345', 'minicar', 2, 'Galle', NULL),
(41, 1, 'John Silva', '+94771234567', 'available', 'DL1234567890', 'Car - Toyota Prius', 5, 'Colombo', NULL),
(42, 94, 'ramesha deshan', '0776517595', 'nonavailable', 'DRIVER12345', 'bike', 2, 'Galle', NULL),
(43, 95, 'Ramesha Silva', '+94712345678', 'available', 'DL9876543', 'SUV - Honda CRV', 8, 'Kandy', NULL),
(44, 96, 'Nimal Perera', '+94723456789', 'nonavailable', 'DL5555666', 'Van - Toyota Hiace', 12, 'Galle', NULL),
(45, 97, 'Kasun Fernando', '+94734567890', 'available', 'DL7777888', 'Bike - Honda CBR', 3, 'Negombo', NULL),
(46, 105, 'John Driver', '1234567890', 'nonavailable', 'DL123456', 'car', 5, 'Colombo', NULL),
(47, 106, 'drivernew', '0776517595', 'nonavailable', 'DRIVER12345', 'car', 3, 'Galle', NULL),
(48, 107, 'drivernewwww', '0776517595', 'nonavailable', 'DRIVER12345', 'car', 3, 'Galle', NULL),
(49, 110, 'akila     ', '0776517595', 'nonavailable', 'BG1234', 'van', 4, 'Galle', NULL),
(50, 112, 'akila     ', '0776517595', 'nonavailable', 'BG1234', 'minicar', 4, 'Galle', NULL),
(51, 115, 'akilaaaaaaaaaa  ', '0776517595', 'nonavailable', 'BG1234', 'minicar', 4, 'Galle', NULL),
(52, 122, 'Test Driver', '0123456789', 'nonavailable', 'DL123456', 'car', 5, 'Colombo', NULL),
(53, 128, 'nayana', '0776517595', 'nonavailable', '', 'car', 4, 'Galle', '/RoutePro-backend(02)/public/uploads/drivers/driver_128_1756228498.jpg'),
(55, 131, 'Gihan Lahiru Bimsara', '0776517595', 'available', '', 'van', 4, 'Galle', '/RoutePro-backend(02)/public/uploads/drivers/driver_131_1757646857.jpg'),
(56, 133, 'driver driver 123', '0776517595', 'nonavailable', '', 'car', 3, 'Galle', NULL),
(57, 135, 'Yuki Navarathne', '0703545654', 'available', '', 'tuk', 3, 'Galewela', '/RoutePro-backend(02)/public/uploads/drivers/driver_135_1757747697.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `guides`
--

CREATE TABLE `guides` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `status` enum('available','nonavailable') NOT NULL,
  `nic` varchar(20) NOT NULL,
  `license_no` varchar(50) NOT NULL,
  `experience` int(11) NOT NULL,
  `location` varchar(100) NOT NULL,
  `languages` text NOT NULL,
  `photo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `guides`
--

INSERT INTO `guides` (`id`, `user_id`, `name`, `phone`, `status`, `nic`, `license_no`, `experience`, `location`, `languages`, `photo`) VALUES
(2, 44, '', '0723456789', 'available', '200129603632', '', 4, 'galle', 'sinhala', NULL),
(3, 46, '', '0723456789', 'available', '200129603632', '', 4, 'galle', 'tamil', NULL),
(4, 47, 'akila sudeepa ', '0776517595', 'available', '200129603630', 'GUIDE45678', 1, 'Badulla', 'Sinahala', '/RoutePro-backend(02)/public/uploads/guides/guide_47_1756229028.jpg'),
(5, 74, 'Test Guide', '0771234567', 'nonavailable', '123456789V', 'GL123', 5, 'Kandy', 'English, Sinhala', NULL),
(6, 75, 'Another Guide', '0712345678', 'nonavailable', '987654321V', 'GL456', 3, 'Colombo', 'English, Tamil', NULL),
(7, 76, 'akila ', '0776517595', 'nonavailable', '200129603632', 'DRIVER12345', 2, 'galle', 'english', NULL),
(8, 98, 'Test Guide Updated', '0779876543', 'available', '199012345678', 'GL1111222', 10, 'Kandy', 'English, Sinhala, German', NULL),
(9, 99, 'Sanath Kumar', '+94712345222', 'nonavailable', '198809876543', 'GL2222333', 10, 'Kandy', 'English, Sinhala, Tamil, German', NULL),
(10, 100, 'Malka Fernando', '+94712345333', 'available', '199512312345', 'GL3333444', 4, 'Galle', 'English, Sinhala, French', NULL),
(11, 101, 'kamala', '0776517595', 'nonavailable', '200129603632', 'DRIVER12345', 2, 'galle', 'english', NULL),
(12, 108, 'kamala', '0776517595', 'nonavailable', '200129603632', 'DRIVER12345', 2, 'galle', 'english', NULL),
(13, 109, 'kamala', '0776517595', 'nonavailable', '200129603632', 'DRIVER12345', 2, 'galle', 'english', NULL),
(14, 113, 'kamala', '0776517595', 'nonavailable', '200129603632', 'DRIVER12345', 2, 'galle', 'english', NULL),
(15, 116, 'kamalaaaa', '0776517595', 'nonavailable', '200129603632', 'DRIVER12345', 2, 'galle', 'english', NULL),
(16, 129, 'Kasun Kariyawasam', '0776517595', 'nonavailable', '200129603632', 'GUIDE12345', 2, 'galle', 'english', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `otp` varchar(6) DEFAULT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `used` tinyint(1) DEFAULT 0,
  `otp_verified` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `password_resets`
--

INSERT INTO `password_resets` (`id`, `user_id`, `email`, `token`, `otp`, `expires_at`, `created_at`, `used`, `otp_verified`) VALUES
(1, 70, 'test@example.com', NULL, '505237', '2025-09-05 06:57:00', '2025-09-05 04:52:00', 1, 0),
(2, 70, 'test@example.com', '750c30378f208d02310157f9725b8ef3868736eb3f72415c222e69ebee41941a', '389579', '2025-09-05 07:22:35', '2025-09-05 04:52:32', 1, 1),
(3, 70, 'test@example.com', NULL, '761283', '2025-09-05 09:47:13', '2025-09-05 07:42:13', 1, 0),
(4, 70, 'test@example.com', NULL, '677822', '2025-09-05 09:55:51', '2025-09-05 07:50:51', 1, 0),
(5, 131, 'gihanbimsara2001@gmail.com', NULL, '440900', '2025-09-05 09:57:36', '2025-09-05 07:52:36', 1, 0),
(6, 70, 'test@example.com', NULL, '195190', '2025-09-05 10:03:30', '2025-09-05 07:58:30', 1, 0),
(7, 131, 'gihanbimsara2001@gmail.com', NULL, '518027', '2025-09-05 10:11:00', '2025-09-05 08:06:00', 1, 0),
(8, 131, 'gihanbimsara2001@gmail.com', NULL, '258983', '2025-09-05 10:11:17', '2025-09-05 08:06:17', 1, 0),
(9, 131, 'gihanbimsara2001@gmail.com', NULL, '867714', '2025-09-05 11:29:05', '2025-09-05 09:24:05', 1, 0),
(10, 131, 'gihanbimsara2001@gmail.com', NULL, '576966', '2025-09-05 11:31:06', '2025-09-05 09:26:06', 1, 0),
(11, 70, 'test@example.com', NULL, '450096', '2025-09-05 11:35:05', '2025-09-05 09:30:05', 1, 0),
(12, 131, 'gihanbimsara2001@gmail.com', NULL, '967041', '2025-09-05 11:36:37', '2025-09-05 09:31:37', 1, 0),
(13, 131, 'gihanbimsara2001@gmail.com', NULL, '579571', '2025-09-05 11:37:19', '2025-09-05 09:32:19', 1, 0),
(14, 70, 'test@example.com', '86e8f1d669d4c1035a772c969fe408f32c8225570e562afe9b564048f67181fc', '113712', '2025-09-05 12:05:37', '2025-09-05 09:35:32', 1, 1),
(15, 131, 'gihanbimsara2001@gmail.com', '81340d09f6ebbe406d9adf1b3cf03464466a620912e433fcc31d0ada80618747', '799611', '2025-09-05 12:07:16', '2025-09-05 09:36:37', 1, 1),
(16, 131, 'gihanbimsara2001@gmail.com', NULL, '482596', '2025-09-05 11:46:04', '2025-09-05 09:41:04', 1, 0),
(17, 131, 'gihanbimsara2001@gmail.com', NULL, '786468', '2025-09-05 11:54:10', '2025-09-05 09:49:10', 1, 0),
(18, 131, 'gihanbimsara2001@gmail.com', '244d051a75f4e53df532a224d18072eb9b2ef3627f1e67420f44bd9388cb1b48', '548957', '2025-09-05 12:20:49', '2025-09-05 09:49:26', 1, 1),
(19, 131, 'gihanbimsara2001@gmail.com', NULL, '121672', '2025-09-05 11:58:01', '2025-09-05 09:53:01', 1, 0),
(20, 131, 'gihanbimsara2001@gmail.com', NULL, '927547', '2025-09-05 12:01:48', '2025-09-05 09:56:48', 1, 0),
(21, 131, 'gihanbimsara2001@gmail.com', '571e9b46fe931408187ba2eb17153de47a2fae49314b8d32bb99cf438b4be3d2', '522826', '2025-09-05 12:28:24', '2025-09-05 09:57:29', 1, 1),
(22, 131, 'gihanbimsara2001@gmail.com', '8e4c982e5a831cfb4aad4edc5c56ac43f94e64f2f73e2ee719632fde7407fbe9', '776040', '2025-09-05 12:29:21', '2025-09-05 09:59:05', 1, 1),
(23, 131, 'gihanbimsara2001@gmail.com', NULL, '622233', '2025-09-05 12:07:23', '2025-09-05 10:02:23', 1, 0),
(24, 131, 'gihanbimsara2001@gmail.com', NULL, '669304', '2025-09-05 12:09:59', '2025-09-05 10:04:59', 1, 0),
(25, 131, 'gihanbimsara2001@gmail.com', NULL, '111370', '2025-09-05 12:10:16', '2025-09-05 10:05:16', 1, 0),
(26, 131, 'gihanbimsara2001@gmail.com', NULL, '971522', '2025-09-05 12:10:56', '2025-09-05 10:05:56', 1, 0),
(27, 131, 'gihanbimsara2001@gmail.com', NULL, '204990', '2025-09-05 12:12:50', '2025-09-05 10:07:50', 1, 0),
(28, 131, 'gihanbimsara2001@gmail.com', NULL, '947967', '2025-09-05 12:13:13', '2025-09-05 10:08:13', 1, 0),
(29, 131, 'gihanbimsara2001@gmail.com', NULL, '429640', '2025-09-05 12:19:14', '2025-09-05 10:14:14', 1, 0),
(30, 131, 'gihanbimsara2001@gmail.com', NULL, '371023', '2025-09-05 12:56:51', '2025-09-05 10:51:51', 1, 0),
(31, 131, 'gihanbimsara2001@gmail.com', NULL, '702717', '2025-09-05 18:23:58', '2025-09-05 16:18:58', 1, 0),
(32, 70, 'test@example.com', NULL, '495064', '2025-09-05 18:27:07', '2025-09-05 16:22:07', 1, 0),
(33, 131, 'gihanbimsara2001@gmail.com', NULL, '892217', '2025-09-05 18:29:05', '2025-09-05 16:24:05', 1, 0),
(34, 70, 'test@example.com', NULL, '488936', '2025-09-05 18:31:01', '2025-09-05 16:26:01', 1, 0),
(35, 131, 'gihanbimsara2001@gmail.com', '47db104157a116d0694d9f897aecb606b59be303deb58a4265ecb2852c9ee0a5', '787738', '2025-09-05 18:57:01', '2025-09-05 16:26:39', 1, 1),
(36, 131, 'gihanbimsara2001@gmail.com', NULL, '967976', '2025-09-05 18:32:57', '2025-09-05 16:27:57', 1, 0),
(37, 131, 'gihanbimsara2001@gmail.com', NULL, '926012', '2025-09-05 18:35:36', '2025-09-05 16:30:36', 1, 0),
(38, 131, 'gihanbimsara2001@gmail.com', '4d9312069097a32bd9f8c76dae3e2250d196bbcf84c8adf91d7309e031bc4100', '808071', '2025-09-05 19:03:49', '2025-09-05 16:32:09', 1, 1),
(39, 131, 'gihanbimsara2001@gmail.com', '7de45d3aa9f6ff80c73b846fea923bc374a0f307442f9c6958139ad06164fe80', '947718', '2025-09-05 19:06:09', '2025-09-05 16:35:11', 1, 1),
(40, 131, 'gihanbimsara2001@gmail.com', '898f5b55b9a4f0ffefa8ce9260e36011aebef012bfd82c428688c0b007a42ae7', '481454', '2025-09-05 19:13:15', '2025-09-05 16:42:15', 1, 1),
(41, 131, 'gihanbimsara2001@gmail.com', NULL, '555064', '2025-09-05 19:13:40', '2025-09-05 17:08:40', 1, 0),
(42, 131, 'gihanbimsara2001@gmail.com', NULL, '886751', '2025-09-05 19:14:11', '2025-09-05 17:09:11', 1, 0),
(43, 131, 'gihanbimsara2001@gmail.com', NULL, '649288', '2025-09-05 19:14:28', '2025-09-05 17:09:28', 1, 0),
(44, 131, 'gihanbimsara2001@gmail.com', NULL, '519286', '2025-09-05 19:17:14', '2025-09-05 17:12:14', 1, 0),
(45, 131, 'gihanbimsara2001@gmail.com', NULL, '436486', '2025-09-05 19:18:07', '2025-09-05 17:13:07', 1, 0),
(46, 131, 'gihanbimsara2001@gmail.com', NULL, '411650', '2025-09-05 19:18:20', '2025-09-05 17:13:20', 1, 0),
(47, 131, 'gihanbimsara2001@gmail.com', NULL, '986138', '2025-09-05 19:18:38', '2025-09-05 17:13:38', 1, 0),
(48, 70, 'test@example.com', NULL, '353729', '2025-09-05 19:20:39', '2025-09-05 17:15:39', 0, 0),
(49, 131, 'gihanbimsara2001@gmail.com', NULL, '929124', '2025-09-05 19:21:38', '2025-09-05 17:16:38', 1, 0),
(50, 131, 'gihanbimsara2001@gmail.com', NULL, '673353', '2025-09-05 19:22:03', '2025-09-05 17:17:03', 1, 0),
(51, 131, 'gihanbimsara2001@gmail.com', NULL, '990627', '2025-09-05 19:30:49', '2025-09-05 17:25:49', 1, 0),
(52, 131, 'gihanbimsara2001@gmail.com', '8937e3385ebf45512aa0cc2e72685b9dba7d11cfa3abea897aeba4f54f439e66', '486582', '2025-09-05 19:58:22', '2025-09-05 17:27:07', 1, 1),
(53, 131, 'gihanbimsara2001@gmail.com', '94a09ffb7760ae7988f6f6a15541aaa89d4fa2140574745a34fab87849bbe862', '898154', '2025-09-05 21:41:01', '2025-09-05 19:10:19', 1, 1),
(54, 131, 'gihanbimsara2001@gmail.com', '128d59c33d10ec979d5d231c131b459ec9ed9b8dd24541236109dab98b4983e9', '321072', '2025-09-12 04:44:18', '2025-09-12 02:13:50', 1, 1),
(55, 131, 'gihanbimsara2001@gmail.com', 'e5db9c535d5511218d2dc252ced5ca40e88840f5729908a75b48ec84f8aa8eac', '107583', '2025-09-12 10:46:43', '2025-09-12 08:16:03', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `payment_id` int(11) NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `payment_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ratings_review`
--

CREATE TABLE `ratings_review` (
  `review_id` int(11) NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `reviewed_user_id` int(11) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT NULL,
  `review_text` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `routes`
--

CREATE TABLE `routes` (
  `route_id` int(11) NOT NULL,
  `start_location` varchar(100) DEFAULT NULL,
  `end_location` varchar(100) DEFAULT NULL,
  `distance_km` decimal(5,2) DEFAULT NULL,
  `estimated_time` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `travellers`
--

CREATE TABLE `travellers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(25) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `photo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `travellers`
--

INSERT INTO `travellers` (`id`, `user_id`, `name`, `phone`, `created_at`, `photo`) VALUES
(1, 80, 'Updated Test Traveller', '0751111111', '2025-08-21 05:28:02', NULL),
(2, 81, 'API Test Traveller', '0761234567', '2025-08-21 05:28:10', NULL),
(3, 82, 'Sarah Explorer', '0781234567', '2025-08-21 05:29:02', NULL),
(4, 83, 'kolla', '0776524567', '2025-08-21 05:34:34', NULL),
(5, 84, 'Previous UI Test', '0791234567', '2025-08-21 05:40:05', NULL),
(6, 85, 'tharaka paranawithana', '0776517595', '2025-08-21 05:42:40', '/RoutePro-backend(02)/public/uploads/travellers/traveller_85_1756285606.jpg'),
(7, 86, 'Env Test User', '0701234567', '2025-08-21 05:47:59', NULL),
(8, 87, 'tra', '0776517595', '2025-08-21 05:49:22', NULL),
(9, 88, 'lala', '0776517595', '2025-08-21 06:13:44', NULL),
(10, 92, 'lp', '0776517484', '2025-08-21 06:30:19', NULL),
(11, 102, 'Emma Wilson', '+94771234567', '2025-08-21 08:29:57', NULL),
(12, 103, 'James Roberts', '+94771234568', '2025-08-21 08:29:57', NULL),
(13, 104, 'Sophia Chen', '+94771234569', '2025-08-21 08:29:57', NULL),
(14, 111, 'akila     ', '0776517595', '2025-08-23 17:13:43', NULL),
(15, 114, 'akilabal', '0776517595', '2025-08-23 17:17:02', NULL),
(16, 117, 'New Test User', '1234567890', '2025-08-24 06:09:25', NULL),
(17, 118, 'Another Test User', '1234567890', '2025-08-24 06:10:55', NULL),
(18, 119, 'Frontend Test User', '0123456789', '2025-08-24 06:15:13', NULL),
(19, 120, 'Clean Test User', '0123456789', '2025-08-24 06:21:15', NULL),
(20, 121, 'Test Traveller', '0123456789', '2025-08-24 06:25:51', NULL),
(21, 123, 'Test Traveller', '0123456789', '2025-08-24 06:25:59', NULL),
(22, 124, 'akila', '0776517595', '2025-08-24 06:29:09', NULL),
(23, 125, 'akilaloo', '0776517595', '2025-08-24 06:30:02', NULL),
(24, 126, 'lppp', '0776517595', '2025-08-24 06:33:14', NULL),
(25, 127, 'akilallllll', '0776517595', '2025-08-24 07:18:56', NULL),
(26, 132, 'ko', '0776517590', '2025-09-05 18:39:10', NULL),
(27, 134, 'Supun Perera', '0703545654', '2025-09-13 06:53:49', '/RoutePro-backend(02)/public/uploads/travellers/traveller_134_1757746485.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `trips`
--

CREATE TABLE `trips` (
  `trip_id` int(11) NOT NULL,
  `traveler_id` int(11) DEFAULT NULL,
  `route_id` int(11) DEFAULT NULL,
  `driver_id` int(11) DEFAULT NULL,
  `guide_id` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `trip_status` enum('not_started','in_progress','completed','cancelled') DEFAULT 'not_started',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(40) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('traveller','guide','driver','admin') NOT NULL,
  `rating` decimal(2,1) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `rating`, `created_at`, `reset_token`, `reset_token_expiry`) VALUES
(1, 'navodya', 'admin@example.com', 'admin', 'admin', 0.0, '2025-07-25 07:04:50', NULL, NULL),
(12, 'Gihan', 'kumara@gmail.com', '$2y$10$cGdqrU1/8rigWEZ9mcV/T.opALxLIwMmpM5CqziokHpvWqnYtuK8y', 'driver', NULL, '2025-07-27 08:51:21', '2b25057d243eef8f1554d731fddd41a3abd1aca1f2e449e7c7417ee9777462d0', NULL),
(13, NULL, 'gihan@gmail', '$2y$10$SdHQAA22tPW/1hHhUAB.IuVU3T3xFhmVeZeg98WjjHyvO8dm1Y1xG', 'driver', NULL, '2025-07-27 09:55:05', NULL, NULL),
(14, NULL, 'pubudu@gmail.com', '$2y$10$WGV0Kh4aYjTbuYIW/jbHS.rTMuKI9lwM.7BYmRBBXoWUFuGQM1mR.', 'driver', NULL, '2025-07-27 18:23:18', NULL, NULL),
(15, NULL, 'admin@gmail.com', 'Admin123@', 'admin', NULL, '2025-07-27 18:31:25', NULL, NULL),
(16, NULL, 'kalana1@gmail.com', '$2y$10$VTHgN/oYsa1hMM4dqNETGO/dGZOvJjzuwwE6toOlPIl.bOgOOS2La', 'driver', NULL, '2025-07-27 18:33:27', NULL, NULL),
(17, NULL, 'kamala@gmail.com', '$2y$10$/g5G.7/vWLyfeYG5gGwaluq3aGXtgb.wka2Org6JFKAHD8NPNHUXW', 'driver', NULL, '2025-07-27 18:37:23', NULL, NULL),
(18, NULL, 'abcd@gmail.com', '$2y$10$0gjuSzhJlgvQVWAv.B4qluolMrQydvoSkAnsxtraNjrqgMg5wTVGS', 'driver', NULL, '2025-07-28 04:49:20', NULL, NULL),
(19, NULL, 'j123@gmail.com', '$2y$10$ZW3/aGO.3S9yvFrZ0zyTfuRpZVoH/yn/2HMF9k8mcEyEgZ.8HDhFW', 'driver', NULL, '2025-07-28 09:18:20', NULL, NULL),
(20, 'omal', 'omql@gmail.com', '$2y$10$H5peSGoTxYXtFbT0LYLfx.3QWpEgDg.LNWqra.TUPf1NR.GO04SZO', 'driver', 0.0, '2025-07-28 10:22:02', NULL, NULL),
(21, 'omall', 'omqll@gmail.com', '$2y$10$AKNWxQoa.kBnuycWmabbZu9fQzSEuiKyfXGKf5.dikrD1IsOBuMdW', 'driver', 0.0, '2025-07-28 10:36:02', NULL, NULL),
(22, 'kalaum', 'kalum@gmail.com', '$2y$10$UNz0KpkDyaFD0IpWo7Su8eYE.fFxq2eEFGUPSYadmdw6QoByrx5c.', 'driver', 0.0, '2025-07-29 07:16:00', NULL, NULL),
(23, 'nisal', 'nisal@gmail.com', '$2y$10$YGsvUKIm1aNAeu4GJ5m0zu/XbQ/qUqRrHWrLBoNFoxh1CP3D5hN7W', 'driver', 0.0, '2025-07-29 07:16:54', NULL, NULL),
(24, 'driver', 'driver@gmial.com', '$2y$10$0gT9CQ2hqUFyV1AuSKP1RuALAWfekMLP9Vjnr5oqHr.CJpgUjw/V2', 'driver', 0.0, '2025-07-29 10:06:10', NULL, NULL),
(25, '@', 'gihanbimsara2001@gmail', '$2y$10$GqKyjxSQ8H9x4SOF7mOac.yJS8njIKHzVR7k3lrwb4i4RkrrFPx72', 'driver', 0.0, '2025-07-29 10:06:57', NULL, NULL),
(26, 'driver', 'driver1@gmial.com', '$2y$10$IRIU9wOvr4j1AumzRkwz0uLTb9C6JKBKI0f2QCO1/9ouEYyHov8Zq', 'driver', 0.0, '2025-07-29 10:14:08', NULL, NULL),
(27, 'Bimsara', 'gihan2001@gmail.com', '$2y$10$nrDOmfVoPeaB2hqY/1gybOaomxgtiXmwqFPEWUP.r6qb843ENSbmO', 'driver', 0.0, '2025-07-29 10:36:00', NULL, NULL),
(28, NULL, 'lasith@gmail.com', '$2y$10$aQkSlT9.qfvC8xJnkibo..JhELelEEOMmS3Wl4dJLeixe2RxVL6ki', 'traveller', NULL, '2025-07-29 11:11:04', NULL, NULL),
(29, 'hansaka kavinda', 'hansaka@gmail.com', '$2y$10$snJBbjZe4dd3OovW6RT2xuSeF9rc1SlArPWCaA65AEYsbq/rWL3Wa', 'driver', 0.0, '2025-07-29 13:12:57', NULL, NULL),
(30, 'laal', 'laal@gmail.com', 'laal123@', 'driver', 0.0, '2025-07-29 13:17:43', NULL, NULL),
(31, 'Ananda Kumara', 'ananda@gmail.com', '$2y$10$T.ZccaEZlH5VsiyQAY8f0eX82O/zSvUICPnCtuCL6NeBEgrXxuSru', 'driver', 0.0, '2025-07-29 13:58:36', NULL, NULL),
(32, '', 'guider123@gmail.com', '$2y$10$HZ2eTCdiio1IzCZ23KPSfOlYP4R//xq/8WkqbL0KLQQzRZ1lmmM1y', 'driver', 0.0, '2025-07-29 16:17:33', NULL, NULL),
(33, '', 'guider1234@gmail.com', '$2y$10$S.gG1i96o3j43baxkPfs/eNXgb81l33APHoFENfuzsAM424R/BxcC', 'driver', 0.0, '2025-07-29 16:21:34', NULL, NULL),
(34, '', 'guider1235@gmail.com', '$2y$10$k/nWKiYo0v50YEDaYzG1du6FU8uW3JxaJXJSvOMnz6Pvdo9FPEa3m', 'driver', 0.0, '2025-07-29 16:23:18', NULL, NULL),
(35, '', 'navo123@gmail.com', '$2y$10$Yy6qTpbSg9mxRLINxUaDbuASi2YltpVNc9S1EF9864GlAlmP3c11q', 'driver', 0.0, '2025-07-29 16:25:09', NULL, NULL),
(36, '', 'navo1234@gmail.com', '$2y$10$cStkAdtgobyjrMn9JaHtneKfW/bGeG4qkbZEj6SmEOS0SOyEETEZ2', 'guide', 0.0, '2025-07-29 16:26:38', NULL, NULL),
(37, '', 'navo12345@gmail.com', '$2y$10$wZ6Th1osKXQA9dxhDWxYhOVt5sGREX7Bq1u4KN.WdSESORnBj73D6', 'guide', 0.0, '2025-07-29 16:32:44', NULL, NULL),
(38, '', 'navo123456@gmail.com', '$2y$10$QcLsj.TzNgBp5r.gc5UPq.WI7Uih9KQVfn2BN632RW2c1v4f8Vcxy', 'guide', 0.0, '2025-07-29 16:33:13', NULL, NULL),
(39, '', 'navo1234567@gmail.com', '$2y$10$zwglNm.dRvqGRGUCeV9sNOHMBXz1QTtY3RX0twktOWKTtnqObDL/q', 'guide', 0.0, '2025-07-29 17:18:32', NULL, NULL),
(40, '', 'navo12345678@gmail.com', '$2y$10$zrBramSdzgwONjVSAK.2J.uZLGpSqMsDv2Jx/kJCnfHMh42ucFRjG', 'guide', 0.0, '2025-07-29 18:01:12', NULL, NULL),
(41, '', 'navoo123@gmail.com', '$2y$10$1urEauBwxCtShkdnzx47QeJhcj6I89kNgxGD4F9bLT6VL8YLJvV7u', 'guide', 0.0, '2025-07-29 18:05:49', NULL, NULL),
(42, '', 'navoo1234@gmail.com', '$2y$10$aRmeODfc.odBJs7ZKUgQzeGmyKpLDS1Zbz.kUq1KuEs7UuqHCT7tW', 'guide', 0.0, '2025-07-29 18:06:07', NULL, NULL),
(43, '', 'navo12f@gmail.com', '$2y$10$nzsGR9ZJ5XuPIk9fvu1vsO1fZUPQsIjkq/MVOG4fZKfmMn48x2Ika', 'guide', 0.0, '2025-07-29 18:08:22', NULL, NULL),
(44, '', 'navdedeo12f@gmail.com', '$2y$10$e/MzvHPuiy6J00PSKyeGXO//ndTYbKEbGa9wsS1C4HUdlVXmL8Ami', 'guide', 0.0, '2025-07-29 18:13:20', NULL, NULL),
(45, 'Wasantha Mahima', 'wasantha@gmail.com', '$2y$10$sLoqOLGILA6N4v1kgnjeiuciIWjlB0aEZJfvAU4I/mj00I9vBgCLe', 'driver', 0.0, '2025-07-29 18:27:45', NULL, NULL),
(46, '', 'navdedewedtaswo12lpf@gmail.com', '$2y$10$xQKl4xcgy.6R4JIKNUsmxuoFfQNbRm.BSPfG7L5u46sEVH47tRDQG', 'guide', 0.0, '2025-07-29 18:29:45', NULL, NULL),
(47, 'akila sudeepa ', 'akila@gmail.com', '$2y$10$X0NpxnvRO.GLX2F7KmQcUuWYGaj1dBkgc6TxceChGNQdCFE20eNRe', 'guide', 0.0, '2025-07-29 18:37:19', NULL, NULL),
(62, 'praneeth kariyawasam', 'praneeth@gmail.com', '$2y$10$71OBYgy.9tJyk2W5dtiaquGltLPh8kAsvNnnlW1xkKZ6tHnh1TQ8C', 'driver', 0.0, '2025-07-30 04:24:15', NULL, NULL),
(63, 'lasith', 'lasith123@gmail.com', '$2y$10$e1hpCVAtiIHVdjDT9b.oI.ow7/EyCi03xRslzv.RdT39rUsXI/YcC', 'driver', 0.0, '2025-07-30 05:48:24', NULL, NULL),
(64, 'kalana pradeepa', 'kalana123@gmail.com', '$2y$10$FrJ3t5ullbfUjxbmA9XLg.rmgOgRg4c3WiHrG7l6X/EMqOhvldEkO', 'driver', 0.0, '2025-07-30 06:47:03', NULL, NULL),
(65, 'kalama', 'kalama@gmail.com', '$2y$10$saJVUo817jDNFplBTqo9FO0d/vMh5p8.znK0vmNtXHpWK8nwQpRdq', 'driver', 0.0, '2025-08-10 12:35:15', NULL, NULL),
(66, 'kalama', 'kalama12@gmail.com', '$2y$10$Tnv.UEPqI06JxviQu/GyV.54NJKpTccMqmHs4G6du.Wsy3Sck8ure', 'driver', 0.0, '2025-08-10 12:44:52', NULL, NULL),
(67, 'Test Driver', 'testdriver1755751230941@test.com', '$2y$10$435jLOP6SIv6HU.KmOME9.EVRcyQLnWiO7q384F3uCzFwx.8aj5tG', 'driver', 0.0, '2025-08-21 04:40:31', NULL, NULL),
(68, 'Test Driver', 'testdriver1755751829769@test.com', '$2y$10$gcmGigBTl7SuPvESWwlcReY62EZOWqg9NSzUn8GEKQAbvgCGyBpdy', 'driver', 0.0, '2025-08-21 04:50:29', NULL, NULL),
(69, 'kalama', 'kalama12ss34sx@gmail.com', '$2y$10$XztOdi5ddWIhKWjnMIgpkuRrSsE0oIwTLhouhDbxjNGYo1VkzOrGq', 'driver', 0.0, '2025-08-21 04:57:27', NULL, NULL),
(70, 'Test Driver', 'test@example.com', '$2y$10$za0JxhjMTMtPUUZLgmeOyOcLdpuACmoAG5Uv7CCdFkfOllhf8Ck0O', 'driver', 0.0, '2025-08-21 05:01:07', NULL, NULL),
(71, 'kalama', 'kalamaa@gmail.com', '$2y$10$nWIbyxA3NLztWmqZCTIGluoUcaEc.29rzFJU0BE6VPLEkAKrDwCie', 'driver', 0.0, '2025-08-21 05:06:01', NULL, NULL),
(72, 'kala', 'kalama00@gmail.com', '$2y$10$.cVv0gHhqMmeimIi2U0cZeRHqBJVIlZ8bP4yEaoGP/gvKGho1xR6a', 'driver', 0.0, '2025-08-21 05:07:33', NULL, NULL),
(73, 'kala', 'kalama1234@gmail.com', '$2y$10$ehfZ3LYFCtDWpJI7Bvnex.J3wctmQ2s9dxohIzm5x2OwJlos.bRv2', 'driver', 0.0, '2025-08-21 05:12:06', NULL, NULL),
(74, 'Test Guide', 'guide@example.com', '$2y$10$9xayxlRTUH0bBFPmMsHkr.UwYAxmVAKGu171Hkh7y3H9UDgFWuE3W', 'guide', 0.0, '2025-08-21 05:20:07', NULL, NULL),
(75, 'Another Guide', 'guide2@example.com', '$2y$10$LM4BqJRexiOCsof2CSxTgudG5KhjvqwcTggilzvGew1VdAhYqAzkG', 'guide', 0.0, '2025-08-21 05:21:13', NULL, NULL),
(76, 'akila ', 'akila12@gmail.com', '$2y$10$L0rQpNGDiLxL4hRT6y/23.VW8dTxZlyxkPXJPsu8p079oRb9kMoTK', 'guide', 0.0, '2025-08-21 05:23:03', NULL, NULL),
(80, 'Updated Test Traveller', 'test.traveller@example.com', '$2y$10$RnzCsutd.Iro.waqyrE3suUqi7VR1UCP4Lhog.3g51eVxOkSJml1C', 'traveller', 0.0, '2025-08-21 05:28:02', NULL, NULL),
(81, 'API Test Traveller', 'api.traveller@example.com', '$2y$10$38zTZiu36cnBjtBEbSxWtut9mHI6iEq/xycbLeWrFBvtpmM5iKP.S', 'traveller', 0.0, '2025-08-21 05:28:10', NULL, NULL),
(82, 'Sarah Explorer', 'sarah.explorer@example.com', '$2y$10$kJUdjfDu2WpuGYcUMKtMWuJ0mEd2yJns7YsJePce5l.74PgS0lwkS', 'traveller', 0.0, '2025-08-21 05:29:02', NULL, NULL),
(83, 'kolla', 'kolla@gmail.com', '$2y$10$POx6oLBKecQGxsiiu2zPRemS.fWv8YyNRzo/AzN29YIezLjt8yHyy', 'traveller', 0.0, '2025-08-21 05:34:34', NULL, NULL),
(84, 'Previous UI Test', 'prevui@example.com', '$2y$10$KCGSiBrR/LX.M4ySuhaeO.KKxdVK9FanIyezbWCyJEIPctMEzKDZi', 'traveller', 0.0, '2025-08-21 05:40:05', NULL, NULL),
(85, 'tharaka paranawithana', 'tharaka@gmail.com', '$2y$10$h0pE1Wrx/bR5C0VE7qIzqOK1Wb.59FkTmUS3/2OfRBYK.gmnjkY6i', 'traveller', 0.0, '2025-08-21 05:42:40', NULL, NULL),
(86, 'Env Test User', 'envtest@example.com', '$2y$10$6fwosBKzpKdfeR.d1yDYZu7FON79c.1idC.QXSwTEQIZLfJyrYE22', 'traveller', 0.0, '2025-08-21 05:47:59', NULL, NULL),
(87, 'tra', 'tra1@gmial.com', '$2y$10$RSnDK81eGqQp5X8.H6ric.GSAyEE4B1IUmmlPwWwBbY25Gm3otr1.', 'traveller', 0.0, '2025-08-21 05:49:22', NULL, NULL),
(88, 'lala', 'lala@gmail.com', '$2y$10$y21Udfa4fDquITRaGg1zKOFoGdWQhaTlcn9H/aqaijlC7QUNvNFmO', 'traveller', 0.0, '2025-08-21 06:13:44', NULL, NULL),
(89, 'kala', 'kalama1200@gmail.com', '$2y$10$rUlldP2.rpbo04yGxIkX0ea1fSY8mBNofYh5dDarHAHUxQyP5A7Qi', 'driver', 0.0, '2025-08-21 06:14:59', NULL, NULL),
(90, 'kala', 'kalama1200ass@gmail.com', '$2y$10$Y5L300B/ReeSUnVz5o3QZej/k3sjfs4LLlaZfyxtSCuN4Pq5QXyDS', 'driver', 0.0, '2025-08-21 06:16:07', NULL, NULL),
(91, 'dri', 'dri@gmail.com', '$2y$10$TdEexH7XC5etE6YYho40HeWjfSs.KvO7CPnHJT3uCaYxhnpNkOWJW', 'driver', 0.0, '2025-08-21 06:28:33', NULL, NULL),
(92, 'lp', 'lp@gmail.com', '$2y$10$G.6AgNMLWJi5yV5gFZk4heQ/rGMtXqE7a6yIyzmm.9eWVBU/Rp1iG', 'traveller', 0.0, '2025-08-21 06:30:19', NULL, NULL),
(93, 'dri', 'dri12@gmail.com', '$2y$10$8g0mKhaLYaQOKTAHLrwsSOKNBKpE3S1n4IWaXsBemw0lc3N1Ned3y', 'driver', 0.0, '2025-08-21 06:40:47', NULL, NULL),
(94, 'ramesha deshan', 'ramesha123@gmail.com', '$2y$10$awOICLiawGZ1hzDSdlgL/.51/d8EgxX3HIJ.bQ7YhqZ0STvIn6Uri', 'driver', 0.0, '2025-08-21 07:20:12', NULL, NULL),
(95, 'Ramesha Silva', 'ramesha@example.com', '$2y$10$qFRUKDbR9sma8XxnPLrXQ.gaKXa7RrXkSTp6hO0RoMWJEVJan/WpO', 'driver', NULL, '2025-08-21 07:47:49', NULL, NULL),
(96, 'Nimal Perera', 'nimal@driver.com', '$2y$10$QQvaICuhok8UHh/uLunAg.P10gJnR1NEtkHOx3E.O.D4dJMx2lbR2', 'driver', NULL, '2025-08-21 07:47:49', NULL, NULL),
(97, 'Kasun Fernando', 'kasun@routepro.com', '$2y$10$VC6lgGWwLz23k6NvCXSPnOogNfQofxLAvymaNFuC2syrDixpCFzyW', 'driver', NULL, '2025-08-21 07:47:49', NULL, NULL),
(98, 'Test Guide Updated', 'priya@guide.com', '$2y$10$8DggdVlkBK3ocU/dq8VQn.SnJkj8wWPCrgI4HHwljrPFmkILbaaya', 'guide', NULL, '2025-08-21 08:20:40', NULL, NULL),
(99, 'Sanath Kumar', 'sanath@guide.com', '$2y$10$LaeMlVTA4Z5EDz/KLtj.xeVYIZyWwyLUaWOQeEKy92NJSThMXmsR6', 'guide', NULL, '2025-08-21 08:20:40', NULL, NULL),
(100, 'Malka Fernando', 'malka@routepro.com', '$2y$10$GhJG5jYbUgIeMFFbaAE/XO1L6YGRFUlaCGCvEcKX/ScLNZWlsyb1S', 'guide', NULL, '2025-08-21 08:20:40', NULL, NULL),
(101, 'kamala', 'kamala123@gmail.com', '$2y$10$HBzq1FnCq.00/boQDdvq4Oo2Qb5LuFoRFSLgmjRIcedNwHcvXXsB6', 'guide', 0.0, '2025-08-21 08:26:26', NULL, NULL),
(102, 'Emma Wilson', 'emma@traveller.com', '$2y$10$N7NnCh2Y1s8pyu2D/h3wV.Q52PVtpn4I.Dqy5njq4oK3J0Y80/zuS', 'traveller', NULL, '2025-08-21 08:29:57', NULL, NULL),
(103, 'James Roberts', 'james@explorer.com', '$2y$10$h1cqCVPP6G8S6IuLAZmjNeLiLY0qr7dF8GtXc4eZ2xNRrDBlY6GAS', 'traveller', NULL, '2025-08-21 08:29:57', NULL, NULL),
(104, 'Sophia Chen', 'sophia@routepro.com', '$2y$10$kw8TRq5IevxhQVdWtifAyOY1X2QG9Tu9.F9RNAcId4QAiR2OsDW3.', 'traveller', NULL, '2025-08-21 08:29:57', NULL, NULL),
(105, 'John Driver', 'johndrive@test.com', '$2y$10$1W2xSB.vab930f4FYnOzHOnC29rkGgpS1vmo0IQvDrrSBLC6MzUP.', 'driver', 0.0, '2025-08-23 16:07:26', NULL, NULL),
(106, 'drivernew', 'drivernew@gmail.com', '$2y$10$H0BGU24qgwwsOcdEzPlaTOFiIYhP2b4cL1AxHRa5HiZDYxiJnP19u', 'driver', 0.0, '2025-08-23 16:16:02', NULL, NULL),
(107, 'drivernewwww', 'drivernew123@gmail.com', '$2y$10$Eaw9tnFs4wcrrGtkArpsk.RsOSsWAMR5UNT8EN7FpczdgSh1wECGG', 'driver', 0.0, '2025-08-23 16:45:27', NULL, NULL),
(108, 'kamala', 'kamalaxx@gmail.com', '$2y$10$ZViU.lx7CMYKr4epzCcIgesblUUwuu0LEa7ZB5QUacbm21woU7ozS', 'guide', 0.0, '2025-08-23 16:46:36', NULL, NULL),
(109, 'kamala', 'kamalaxxyy@gmail.com', '$2y$10$rPl.8kElWH5K7v/l/J26o.klGcs9NwrQ8Xoba.QraGvaaF0Dx2Mfu', 'guide', 0.0, '2025-08-23 16:59:48', NULL, NULL),
(110, 'akila     ', 'akilapp@gmail.com', '$2y$10$QdyEn5IUvA4Hc0kQ5Y3b5.CvKh4g6cxalfOXAg6XwKsuk1T9Bm8Va', 'driver', 0.0, '2025-08-23 17:00:57', NULL, NULL),
(111, 'akila     ', 'akila99@gmail.com', '$2y$10$VsALyNtNTlY22gMqKYGj7.pDnwjV3mfp0sdd8Q7BTKdB43JoNSWnW', 'traveller', 0.0, '2025-08-23 17:13:43', NULL, NULL),
(112, 'akila     ', 'akila88@gmail.com', '$2y$10$MUkzXYf4iFhvFbbKHDTBW.gO966mf0Qtzb9oOg9NNf7O/hgoQweoK', 'driver', 0.0, '2025-08-23 17:15:42', NULL, NULL),
(113, 'kamala', 'kamalaxxyyzz@gmail.com', '$2y$10$fsdHsOitJF34UbRAs4.BVOTDa/JXYR9Dv7wcNoaj.7EKSmpf7ays6', 'guide', 0.0, '2025-08-23 17:16:17', NULL, NULL),
(114, 'akilabal', 'akila000@gmail.com', '$2y$10$fK/3pcSMm/M6V9ileQgf0eobzbCp7HA8x9kqM1Q9uTiu6QOOqpe4G', 'traveller', 0.0, '2025-08-23 17:17:02', NULL, NULL),
(115, 'akilaaaaaaaaaa  ', 'akila8899@gmail.com', '$2y$10$Ue8VjMFJ43kXbicYihv0veiIpWf.9YxYy.j1zgLIBdzS53lAdM7IK', 'driver', 0.0, '2025-08-24 05:58:04', NULL, NULL),
(116, 'kamalaaaa', 'kamalaxxyyzzqq@gmail.com', '$2y$10$y4hpotPxuiU4kh3lT.ZlI.QAuNKTI9D5of71cnHRx3NirjZpf0wgO', 'guide', 0.0, '2025-08-24 05:59:12', NULL, NULL),
(117, 'New Test User', 'newtest@example.com', '$2y$10$q0JH7zCcAP7EFoC/nTtnbuDf/b.Og.i6Ey1mO/SNImjnoxB8KgpWG', 'traveller', 0.0, '2025-08-24 06:09:25', NULL, NULL),
(118, 'Another Test User', 'anothertest@example.com', '$2y$10$aFGyXqzM5umR949AsEx6teE8RMoNeTfCE4FvY.D.YApjuJwvqWgeK', 'traveller', 0.0, '2025-08-24 06:10:55', NULL, NULL),
(119, 'Frontend Test User', 'frontend@example.com', '$2y$10$U6C/UBsP8copGkBCTBtoSuOVV1NM.9FWvVZJND276QWrG/aYBu6oi', 'traveller', 0.0, '2025-08-24 06:15:13', NULL, NULL),
(120, 'Clean Test User', 'cleantest@example.com', '$2y$10$Nsr/Pad/j/JOh9vcosqFKOnuB/SVm7VKbcFK10oamW7WgFNXR4xpS', 'traveller', 0.0, '2025-08-24 06:21:15', NULL, NULL),
(121, 'Test Traveller', 'traveller1756016751005@test.com', '$2y$10$Ndto9aJsBU9MWiDCx9DTF.K2ZwdyMDb51JO8VefWtsyyCWoOyS6i.', 'traveller', 0.0, '2025-08-24 06:25:51', NULL, NULL),
(122, 'Test Driver', 'driver1756016753986@test.com', '$2y$10$3iaUJyJFmlPZrw2MWNiDXeUTd4AhJTOz4UewoFSuF0nZflI8gY3W.', 'driver', 0.0, '2025-08-24 06:25:54', NULL, NULL),
(123, 'Test Traveller', 'traveller1756016759617@test.com', '$2y$10$Xx18GSSc8uRDw2a3w91/6uuYF.sbRMDEpva9OSZEj0bPqI/968zye', 'traveller', 0.0, '2025-08-24 06:25:59', NULL, NULL),
(124, 'akila', 'akila.unique.test@gmail.com', '$2y$10$firP1WlZIdOBs1OUXUj1ruC9ijMOSqBGeOJPTmU8lC2lo79MHZaTi', 'traveller', 0.0, '2025-08-24 06:29:09', NULL, NULL),
(125, 'akilaloo', 'akila88loo@gmail.com', '$2y$10$nFzwUdzdOpYnmVuKsaF2luLG2MupisSNPTjd.caNWIKAu0kfyU91q', 'traveller', 0.0, '2025-08-24 06:30:02', NULL, NULL),
(126, 'lppp', 'akila88lppp@gmail.com', '$2y$10$c2Tla58o3RLUfeDyCVFdTO6YZzbtycl6w7gzdqyNWDT9d.6txA9fK', 'traveller', 0.0, '2025-08-24 06:33:14', NULL, NULL),
(127, 'akilallllll', 'akila88llll@gmail.com', '$2y$10$6lFNXIhb.DLm/.3C3JgMMOwvd.E/OL5DFjKdWq.gFojS54PJI6/Rq', 'traveller', 0.0, '2025-08-24 07:18:56', NULL, NULL),
(128, 'nayana', 'akila889900@gmail.com', '$2y$10$vj65/NV8F71ewUwS26iJpeSxUwlVY1bVGkiogcxdGSP83uYguPhvy', 'driver', 0.0, '2025-08-26 12:36:22', NULL, NULL),
(129, 'Kasun Kariyawasam', 'kasun123@gmail.com', '$2y$10$v98ndwMaydPTwwbovArAo.Tx3YpYZYl1vvEfKNbhTtIIzAB4UIi2W', 'guide', 0.0, '2025-08-26 12:58:03', NULL, NULL),
(130, 'abishek kalhara', 'kasun12345@gmail.com', '$2y$10$nCTlGi6zrmitC0rifb742OoAOwcifS1OGUhLlYEfR4AdG5XctqSRi', 'driver', 0.0, '2025-08-26 17:35:28', NULL, NULL),
(131, 'Gihan Lahiru Bimsara', 'gihanbimsara2001@gmail.com', '$2y$10$q/8Pb2yiXVApc4.mnabvheFQLV/xJ4awn4KPN4XFsKskxPOMUzaLm', 'driver', 0.0, '2025-09-05 04:39:28', NULL, NULL),
(132, 'ko', 'ko@gmail.com', '$2y$10$7j1NsUe..BBEpnwHrac65uf5KwKf8Wp5YlOwRfUHNeGqKctEAv5iS', 'traveller', 0.0, '2025-09-05 18:39:10', NULL, NULL),
(133, 'driver driver 123', 'driverdriver@gmail.com', '$2y$10$u28.C5JMogKuMW1APEbdneaV8.A2ZODA/PubAUjvt6sOVzLLZS0IK', 'driver', 0.0, '2025-09-13 05:41:06', NULL, NULL),
(134, 'Supun Perera', 'supun@gmail.com', '$2y$10$AVgkEKtH8LpCA8cttoatFeKFFfUPkKox8c54xok2RqEG6vXYljPH2', 'traveller', 0.0, '2025-09-13 06:53:49', NULL, NULL),
(135, 'Yuki Navarathne', 'yuki@gmail.com', '$2y$10$erlUOzYDKvyQxhALp9ciCu7r22ZFh7mHt6k9/Fus54sWxInz1wb6u', 'driver', 0.0, '2025-09-13 07:13:53', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_sessions`
--

CREATE TABLE `user_sessions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `session_token` varchar(64) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_sessions`
--

INSERT INTO `user_sessions` (`id`, `user_id`, `session_token`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 47, '95c4c6e6af233e693166d60e56a56556d5677acbddda3e06042ce0686dd5f37d', '2025-08-22 11:01:20', '2025-08-21 09:01:20', '2025-08-21 09:01:20'),
(2, 62, 'e10dad45f17e8ae27ee3df5bf50d7cfe5c9dadbb351900e9aa4ad4bd90522e5f', '2025-08-22 11:01:45', '2025-08-21 09:01:45', '2025-08-21 09:01:45'),
(3, 85, '81d66903601129fab7ef141112cff5ca1140b588cef3c3798dc6be63c54a55f1', '2025-08-22 11:01:55', '2025-08-21 09:01:55', '2025-08-21 09:01:55'),
(4, 47, 'bd4eb3e3c35a77c1477a35b34dd8026d5b98ca66cd8d6a9c03df9651b3c68380', '2025-08-22 11:04:19', '2025-08-21 09:04:19', '2025-08-21 09:04:19'),
(5, 85, 'cbbf3763e1348be89a3f2b79c3b2c0fc4228143e1be58493aa612ab66690eece', '2025-08-22 11:04:40', '2025-08-21 09:04:40', '2025-08-21 09:04:40'),
(6, 47, 'a40f728d0e511d2b7f803918e8778543a95b9f12e95ed1aedc408fd64937d3a2', '2025-08-22 11:08:58', '2025-08-21 09:08:58', '2025-08-21 09:08:58'),
(7, 47, '9681b4c4b34e322eeae57160b58d8742006d1cabc53255cd1f67237062053258', '2025-08-22 11:17:44', '2025-08-21 09:17:44', '2025-08-21 09:17:44'),
(8, 47, '1b6ab0bbe9385821cfa56e210cf28e7b80261a3f3483625f7d2cac4c31a3910c', '2025-08-22 15:32:46', '2025-08-21 13:32:46', '2025-08-21 13:32:46'),
(9, 47, 'fa49a3aab2c9fe1fe606c6b69df010462a6620a01de0a3304e9bf07aab78b378', '2025-08-22 15:33:22', '2025-08-21 13:33:22', '2025-08-21 13:33:22'),
(10, 62, 'ec61bd4dfeb7002720c1c704d1a4a2774e3a6e1bbd0a339425a3dc4ce5b36fff', '2025-08-22 15:41:19', '2025-08-21 13:41:19', '2025-08-21 13:41:19'),
(11, 47, '8e29ca78c5f0d668b5e86ee8091039e1b02a9081e2ae8e16e74b82bac228e8b1', '2025-08-22 15:58:19', '2025-08-21 13:58:19', '2025-08-21 13:58:19'),
(12, 47, 'a2118b6a627941f457ddf9dee039a7f76b00d71b2465a26b556d93f308a7174a', '2025-08-22 18:28:42', '2025-08-21 16:28:42', '2025-08-21 16:28:42'),
(13, 62, 'ca1c05b4ee905f5ec7854772147e63a54a04d064de2217aa29b614fb3caf0032', '2025-08-22 18:29:00', '2025-08-21 16:29:00', '2025-08-21 16:29:00'),
(14, 85, 'f0f6470e5426329e9c8250dbe140c78bdad92643d58f40993ccc6b7cd3188b33', '2025-08-22 18:29:15', '2025-08-21 16:29:15', '2025-08-21 16:29:15'),
(15, 47, 'e787bbee7cda88a3a3d99b560dce27e56ea88fe54bc03d822df151efa9193491', '2025-08-22 19:06:44', '2025-08-21 17:06:44', '2025-08-21 17:06:44'),
(16, 62, '53b63dd90dff907351a3a2eb56045e1965d4904326d245b2fa24316f2f1eeb24', '2025-08-22 19:07:00', '2025-08-21 17:07:00', '2025-08-21 17:07:00'),
(17, 47, '41084a7a2774be51b9eb3a0cef66ed7dc974f8fb38479a43aefe2d7fdc2d65c6', '2025-08-24 11:04:02', '2025-08-23 09:04:02', '2025-08-23 09:04:02'),
(18, 62, '5cff19413629dba57de7499f91f7f47e44373856bd83b6425f68f269c4a824bb', '2025-08-24 11:04:12', '2025-08-23 09:04:12', '2025-08-23 09:04:12'),
(19, 62, '3ba9d6cd63ebe543a63ea0a9ed4deaa81e88233a8095b6809e5b86d2fa126c5d', '2025-08-24 11:04:37', '2025-08-23 09:04:37', '2025-08-23 09:04:37'),
(20, 47, 'd9b9ed6a86307f6f08965e24dfdc08799b211ad82025e2f56f03b7d13e15b0e5', '2025-08-24 11:04:55', '2025-08-23 09:04:55', '2025-08-23 09:04:55'),
(21, 85, '02aafae594a982638bd8e88857beeff554df6bb1ada84a083cb9f60f88cb16a2', '2025-08-24 11:05:07', '2025-08-23 09:05:07', '2025-08-23 09:05:07'),
(22, 62, '1ff1876ebc72c145438e1dc58693452ead6b9febb715266b0a1552a82652ddc1', '2025-08-24 11:07:51', '2025-08-23 09:07:51', '2025-08-23 09:07:51'),
(23, 47, 'd72934f8bb186141acd0ff511a7486fa5794ac295081d19e50ba19edcbe45556', '2025-08-24 11:31:24', '2025-08-23 09:31:24', '2025-08-23 09:31:24'),
(24, 62, '9e453b37f061df97cfce8eb1ec8c3f7ab5dc957b7749b0520f157885bedfc37b', '2025-08-24 11:31:36', '2025-08-23 09:31:36', '2025-08-23 09:31:36'),
(25, 62, 'b1f1a53fc37ad96779189846e2adffedd5e3dc99306ae8731e8e2d87a6c77d0c', '2025-08-24 14:09:25', '2025-08-23 12:09:25', '2025-08-23 12:09:25'),
(26, 62, 'f183a855e18619145c7a3dbe8e6b289006e3794ba9e02d1c8b6b9ae6214a75d8', '2025-08-24 15:34:44', '2025-08-23 13:34:44', '2025-08-23 13:34:44'),
(27, 47, '3f8adcf6623cb6ebf152f776039aea22cc6b90874a639c909cd2ffd8d4e2d101', '2025-08-24 15:34:55', '2025-08-23 13:34:55', '2025-08-23 13:34:55'),
(28, 85, '60c46aaedaccf38b7da31c9a874e6d1ca5d54556c93980d1414d63b58f0f463b', '2025-08-24 15:35:35', '2025-08-23 13:35:35', '2025-08-23 13:35:35'),
(29, 62, 'a1c1270e35924ab636fc1f88b6b7a9b8eb36fc41cb4213d495f08037d5b0f5c6', '2025-08-24 16:09:54', '2025-08-23 14:09:54', '2025-08-23 14:09:54'),
(30, 62, '97a898c8b469922c8fdceffe4be58d86f6ad2cafb6180f5a83776da137242517', '2025-08-24 16:14:47', '2025-08-23 14:14:47', '2025-08-23 14:14:47'),
(31, 62, 'b6a4e9e13f4aaa6437dcb9477bf22a94ecf1dd4a77ea510e1c4cf542574d33af', '2025-08-24 17:21:22', '2025-08-23 15:21:22', '2025-08-23 15:21:22'),
(32, 47, '58cd7b39bc826ffe62ab3b3dc4bda215882818c390874495defdd9ed10f0a4d9', '2025-08-24 17:26:09', '2025-08-23 15:26:09', '2025-08-23 15:26:09'),
(33, 62, '8be796d5f4d4a8f243102df304eadb5c6e30a95424094f38bd8b2c12a608cf6b', '2025-08-24 17:38:01', '2025-08-23 15:38:01', '2025-08-23 15:38:01'),
(34, 47, 'a4b0bdfc5809c7a576595093ad86e4ba0f370d80545cd976effaf496d9d73286', '2025-08-24 17:47:04', '2025-08-23 15:47:04', '2025-08-23 15:47:04'),
(35, 62, '24e0f73dd07d7e88385abd43a33976b222b8f0275bc12d9f676475a532455cc2', '2025-08-24 17:47:20', '2025-08-23 15:47:20', '2025-08-23 15:47:20'),
(36, 62, '019414232f124514a7c8c3827aa20a8a62943bf928ef147eaf0345ad963b4d80', '2025-08-24 17:50:18', '2025-08-23 15:50:18', '2025-08-23 15:50:18'),
(37, 62, '4cff45acd8bff2b9c618646d3bddaa88bb56d6c9a156dfb21a92ae2cd7bd9e45', '2025-08-24 17:51:25', '2025-08-23 15:51:25', '2025-08-23 15:51:25'),
(38, 62, '1483953b5e37bd36fcbd4c91f5d64a05a55ddf83d8e8afe8f169eedfae5232f8', '2025-08-24 17:51:47', '2025-08-23 15:51:47', '2025-08-23 15:51:47'),
(39, 62, '815aa50052e51997858cdcca08ebe7c42c44acb179bb6357334f0570e742101a', '2025-08-24 17:56:22', '2025-08-23 15:56:22', '2025-08-23 15:56:22'),
(40, 85, 'd465f056c1fabae522ae4a7162ca7036d66644df5e0d3b40bdc7adfd264e3cda', '2025-08-24 17:56:35', '2025-08-23 15:56:35', '2025-08-23 15:56:35'),
(41, 47, 'c1ae22212fa502a89b28f827b22e31af54bdfd81c74959fa2aabb9854fd342c1', '2025-08-24 17:56:49', '2025-08-23 15:56:49', '2025-08-23 15:56:49'),
(42, 106, '545c098cffa518a2d6418fc721f349e7f71b75c70a425d47695d0363d6462b5f', '2025-08-24 18:17:32', '2025-08-23 16:17:32', '2025-08-23 16:17:32'),
(43, 47, '084fe71d5a33d1e6855a516ab6162d8b501de174245973166ba87a7a3977693e', '2025-08-24 18:33:22', '2025-08-23 16:33:22', '2025-08-23 16:33:22'),
(44, 107, '052f593848b85ae90a9426c34f82ae130747ae9434840eb3422ea85b7568efdb', '2025-08-24 18:45:45', '2025-08-23 16:45:45', '2025-08-23 16:45:45'),
(45, 108, '567e2802517cd947bbd3fcb5ec8970815f069bf3c443b6aa449defdd92fa2da0', '2025-08-24 18:46:56', '2025-08-23 16:46:56', '2025-08-23 16:46:56'),
(46, 109, '18403d4dcad952b2344542d5859beecf9afaf562f75b6adb09c835d509086fde', '2025-08-24 18:59:58', '2025-08-23 16:59:58', '2025-08-23 16:59:58'),
(47, 110, 'b99fddbf51ea94caa792f5fe0c4aec872462821556ac238dfb175f30238d9f2b', '2025-08-24 19:01:17', '2025-08-23 17:01:17', '2025-08-23 17:01:17'),
(48, 62, '47f086173693608388e9e2797b2201eba5f1b33fa4a07405d4eb830013a42517', '2025-08-24 19:05:10', '2025-08-23 17:05:10', '2025-08-23 17:05:10'),
(49, 111, '8d67ef6e7b0526d01498f0e002808f9c3201d0b45e3e2b0830c8ef3575ba3e4f', '2025-08-24 19:14:03', '2025-08-23 17:14:03', '2025-08-23 17:14:03'),
(50, 112, '771bc1001f8bd010f5bef700c299e30e5d34b941f13dcf1f9c74f7156e7b874c', '2025-08-24 19:15:53', '2025-08-23 17:15:53', '2025-08-23 17:15:53'),
(51, 113, 'ae95b48cbb573afab4f0a40dfc6705293f1aad2f8dfc341c8eb8b1d8ff84d2f9', '2025-08-24 19:16:28', '2025-08-23 17:16:28', '2025-08-23 17:16:28'),
(52, 114, '835336fb66690bc4edb1bd35c2f02c57264f960caefe5d609d08910dc9ff5bd0', '2025-08-24 19:17:14', '2025-08-23 17:17:14', '2025-08-23 17:17:14'),
(53, 47, '79e072d44c145b1527ef4a14b5839467d597692ebe79f3a454209dcf0a488e24', '2025-08-24 21:16:31', '2025-08-23 19:16:31', '2025-08-23 19:16:31'),
(54, 62, 'd2b9b450d142ac732e46e157c0dc3b7c5c504b1ade7548ec2c54632ae30f40c9', '2025-08-24 21:26:53', '2025-08-23 19:26:53', '2025-08-23 19:26:53'),
(55, 62, '9d498979a44fd261c4c56d562391a4acd01e5339406395b724ce289fd921f8ff', '2025-08-24 21:54:31', '2025-08-23 19:54:31', '2025-08-23 19:54:31'),
(56, 47, 'fa952db32e10fed08dc1ee5fdc16326562dc5f0d387c32120da6c796598c8009', '2025-08-24 22:02:27', '2025-08-23 20:02:27', '2025-08-23 20:02:27'),
(57, 62, '343ae4e50b07fc28477fb5787e37436a03c5e9df4d49ab99863abc777274b384', '2025-08-25 07:39:45', '2025-08-24 05:39:45', '2025-08-24 05:39:45'),
(58, 62, '0fa13317245c9fcadceb8edf66364d88e6e8a32665648328ec02c801db638227', '2025-08-25 07:40:19', '2025-08-24 05:40:19', '2025-08-24 05:40:19'),
(59, 47, '08057ccb2b4d082bf7cfed3662bea92ad530508bb4e68745176010955ca75e8e', '2025-08-25 07:41:34', '2025-08-24 05:41:34', '2025-08-24 05:41:34'),
(60, 62, '46327885e075ccadaac1f5a23f4c2b1b94fd6126b6701330ad3e672685ef3eaa', '2025-08-25 07:41:48', '2025-08-24 05:41:48', '2025-08-24 05:41:48'),
(61, 93, 'bef25beb9fa05c9b0681ae3496da6c3f6da833dfae537e6eee3ce580852490d2', '2025-08-25 07:56:47', '2025-08-24 05:56:47', '2025-08-24 05:56:47'),
(62, 62, 'a06258e2862b23eff1dc6e049bc113e3b901b5ebaccde117d916ae216dcf8a51', '2025-08-25 07:57:03', '2025-08-24 05:57:03', '2025-08-24 05:57:03'),
(63, 47, '85be1af49947b0026db704c5dcd49f32f5e040df5d61d7d6c44d564fa1a57797', '2025-08-25 07:57:20', '2025-08-24 05:57:20', '2025-08-24 05:57:20'),
(64, 62, 'cffc70869237775c979e835994531e78a7147ea5301886ce3a1e72e473530255', '2025-08-25 07:57:33', '2025-08-24 05:57:33', '2025-08-24 05:57:33'),
(65, 115, '7c1e6bc0bd6cf039707b582ce4a785cee65e5c934e654cdd39f571f73888b315', '2025-08-25 07:58:42', '2025-08-24 05:58:42', '2025-08-24 05:58:42'),
(66, 116, '2baace839a41211db3ccadba01ddee49eb16a426ce6d71a0e5ee935a0db5941c', '2025-08-25 07:59:26', '2025-08-24 05:59:26', '2025-08-24 05:59:26'),
(67, 125, 'cb613175059eab3e5cd2741848d9a8d6fe5598681d334f051227680d13ec2a7c', '2025-08-25 08:30:14', '2025-08-24 06:30:14', '2025-08-24 06:30:14'),
(68, 47, '3f0a49de4395e2c6fa3e785fa8b4679cb9d7fbc3b7c713e8081fe6b29a3c34b5', '2025-08-25 08:31:10', '2025-08-24 06:31:10', '2025-08-24 06:31:10'),
(69, 85, 'e4a9c5dd915c5aca03b6e14867c74254386910d8b71d8540527f424d63c39516', '2025-08-25 08:31:21', '2025-08-24 06:31:21', '2025-08-24 06:31:21'),
(70, 126, '0e1be030ecbc88d76118ea8dd358a606b2009a7a1c961dd046f6121b9327529e', '2025-08-25 08:33:23', '2025-08-24 06:33:23', '2025-08-24 06:33:23'),
(71, 62, 'f444bc9e62796485a02267e5bc6e50c49f51f2a8cb4136b44f2cb81409d7eaff', '2025-08-25 09:18:06', '2025-08-24 07:18:06', '2025-08-24 07:18:06'),
(72, 47, 'bea2c4a08564e09c019295bf74d68023c4fc1640400ca94c77796316deec3eb1', '2025-08-25 09:18:19', '2025-08-24 07:18:19', '2025-08-24 07:18:19'),
(73, 85, '9d7f5e8c16e164803a9f63c28a0d0d06059f57269c99197a1c0ba9050cd16452', '2025-08-25 09:18:28', '2025-08-24 07:18:28', '2025-08-24 07:18:28'),
(74, 127, '661f32b7e24386d79705e2ce08f90f17e0b93ab50719d67b5182d8a0191700c2', '2025-08-25 09:19:12', '2025-08-24 07:19:12', '2025-08-24 07:19:12'),
(75, 62, 'edd24f00a52a74a5c72f3308ed44f20e259b09765098f042a447795731f48f40', '2025-08-27 10:33:20', '2025-08-26 08:33:20', '2025-08-26 08:33:20'),
(76, 62, '033998f67b0b50198829ce339ebc693b857127c2b43921555478ff16200db576', '2025-08-27 13:23:32', '2025-08-26 11:23:32', '2025-08-26 11:23:32'),
(77, 47, 'bd82f7b067bff307e54383504d69ae2ff10710636bfb68f408ac6cc43da81f97', '2025-08-27 13:48:55', '2025-08-26 11:48:55', '2025-08-26 11:48:55'),
(78, 62, '3ed23b3e99d0d2ab96930e08ba0d7fde1771edff93bed2a7803488189e5df4ec', '2025-08-27 13:50:10', '2025-08-26 11:50:10', '2025-08-26 11:50:10'),
(79, 47, '962f6d793e45c399c5257e1565e8d6529a1b75f0d9891821c403fa806411cd2d', '2025-08-27 14:04:19', '2025-08-26 12:04:19', '2025-08-26 12:04:19'),
(80, 62, 'ef11eab5a1393895eea8d426d3fb5e043175a5ef7a43bcf4da1789c8bca9c4e7', '2025-08-27 14:16:52', '2025-08-26 12:16:52', '2025-08-26 12:16:52'),
(81, 62, '3b8b907aefb9e4e05c6fb10d9c443d896dbf51c7c719e57e5dda0c5874ed5730', '2025-08-27 14:34:22', '2025-08-26 12:34:22', '2025-08-26 12:34:22'),
(82, 62, '6d4a5d94e1707ef3e230ee47466e848618991ac0020fd1cbde1ee35a314ddc96', '2025-08-27 14:35:16', '2025-08-26 12:35:16', '2025-08-26 12:35:16'),
(83, 62, 'ca84da77ae3a4a702f0f78995cffb857e70d05690d06e3320e4a84cb238e5694', '2025-08-27 14:35:42', '2025-08-26 12:35:42', '2025-08-26 12:35:42'),
(84, 128, '056c1e56dce51c40f8af910169d4fe956cfa3373cddc8fbd34c27e1dadfd60d4', '2025-08-27 14:36:30', '2025-08-26 12:36:30', '2025-08-26 12:36:30'),
(85, 62, '90a6bee87c481afbf3c0067074eff1abba8b569185afdec79a4fb812b56f4c3a', '2025-08-27 14:54:36', '2025-08-26 12:54:36', '2025-08-26 12:54:36'),
(86, 129, 'b156c0a4f39af33bc470387367f1a2aeec26c02f3f8bad6b46b78ce605a6d4f0', '2025-08-27 14:58:33', '2025-08-26 12:58:33', '2025-08-26 12:58:33'),
(87, 62, '912d9ed447059d6bcf1de59f9be37ed4ae3daec2810ad34117a217d9ac7c5451', '2025-08-27 15:06:13', '2025-08-26 13:06:13', '2025-08-26 13:06:13'),
(88, 62, '4f94129534ee87d942d044975d5e31a3778dd2701db2e5d854e0308663d3fa09', '2025-08-27 15:20:38', '2025-08-26 13:20:38', '2025-08-26 13:20:38'),
(89, 62, '76c6385f93ffdf9e319cc452d8c9cfe81dc01be43fc671c06cd528aabf32c396', '2025-08-27 16:06:07', '2025-08-26 14:06:07', '2025-08-26 14:06:07'),
(90, 62, 'b4443603e6c3a62fa9ab79124fa705794a17e1e1129e74988c30c9cac4925582', '2025-08-27 16:06:59', '2025-08-26 14:06:59', '2025-08-26 14:06:59'),
(91, 62, '6f13d784a60ab59e6a74fae1eb1aa7e9e2e7a991b1d09afdbaac7dfbab13f6a3', '2025-08-27 16:08:13', '2025-08-26 14:08:13', '2025-08-26 14:08:13'),
(92, 62, '1216be1a969e8e6a26fa3150448b7de70fb5a5ccfa6f2399a58120dcc1206e78', '2025-08-27 16:17:53', '2025-08-26 14:17:53', '2025-08-26 14:17:53'),
(93, 62, '8473b35ebde1cb0449b6a349c76ae040bf0387b58428f429d6cb6b778150ee59', '2025-08-27 18:23:56', '2025-08-26 16:23:56', '2025-08-26 16:23:56'),
(94, 62, 'f84570a04f03ebb85b8ed929e34d4ab27187a7eda190a3b6f824defe7cb95c00', '2025-08-27 18:24:14', '2025-08-26 16:24:14', '2025-08-26 16:24:14'),
(95, 62, '281f5358e46d9eafd166dbe1a233d9a6c1cacaf97423a9fa4d8d3337ee244432', '2025-08-27 18:24:47', '2025-08-26 16:24:47', '2025-08-26 16:24:47'),
(96, 62, 'ef71c28829b54a6695577c7fa648a27b57c886dfd3d62ff72bd58c8b401ff6b8', '2025-08-27 18:27:57', '2025-08-26 16:27:57', '2025-08-26 16:27:57'),
(97, 62, '45b3c1df63f6cf170582a642126566575de6506be270d04678afba63a749ee60', '2025-08-27 18:31:01', '2025-08-26 16:31:01', '2025-08-26 16:31:01'),
(98, 62, 'bace83b49635673c7da32ad2e667ce85f58845cffbb2e2a6bf7bdb99323e5527', '2025-08-27 18:31:38', '2025-08-26 16:31:38', '2025-08-26 16:31:38'),
(99, 62, '7e34948f4edcec91aec7ad6508b494a42a733a2904222c95b4a438ef3d8bff93', '2025-08-27 18:46:53', '2025-08-26 16:46:53', '2025-08-26 16:46:53'),
(100, 62, '14753ac0e6a83857b8399498e52579c4f2dcd3be94484d82be6af88c7cba7bbd', '2025-08-27 18:51:45', '2025-08-26 16:51:45', '2025-08-26 16:51:45'),
(101, 62, 'c0cc626e6f071ae5acb7406a148c04b46eaf44c0eca77a5be8caee0e57de627f', '2025-08-27 18:58:19', '2025-08-26 16:58:19', '2025-08-26 16:58:19'),
(102, 62, '0b5167e19539cbe2f6aaaa396e298e53a69257333261da8decf10f5a19fa021d', '2025-08-27 18:58:36', '2025-08-26 16:58:36', '2025-08-26 16:58:36'),
(103, 62, 'e45efd3695c700392fdea4a83262494ec490d254c4b72d10c9de25cd4f2671cf', '2025-08-27 19:00:38', '2025-08-26 17:00:39', '2025-08-26 17:00:39'),
(104, 62, 'dbeb0595fce47df6145a50b9b7e223f16a251020e5b80f6531df60ae69d29e89', '2025-08-27 19:04:12', '2025-08-26 17:04:12', '2025-08-26 17:04:12'),
(105, 62, 'dcf8898ce47cf8a30f90b188dadfbf9f57873dc7fc1cd59fc9e2109be29293b6', '2025-08-27 19:06:52', '2025-08-26 17:06:52', '2025-08-26 17:06:52'),
(106, 47, '8469ff0dc25b353c6a78e82675ecbc08e2ef6d36f270702a60dc2bf4018913ad', '2025-08-27 19:08:54', '2025-08-26 17:08:54', '2025-08-26 17:08:54'),
(107, 62, '75d932e6333c45e14db3d0e474c9c6731bc779a54cf3a3d2376756b56a03ab64', '2025-08-27 19:13:24', '2025-08-26 17:13:24', '2025-08-26 17:13:24'),
(108, 128, '006b374b7dc935a982ba8f743fadb745ad9334a7fc9de479a9c55899e7430f50', '2025-08-27 19:14:18', '2025-08-26 17:14:18', '2025-08-26 17:14:18'),
(109, 62, 'e4496131532774f262b0302f7a749440c769e60ac42df5da727109281294069a', '2025-08-27 19:15:29', '2025-08-26 17:15:29', '2025-08-26 17:15:29'),
(110, 62, '1179710c06e0d6c48a99fca312c4ca36dd0666c8410329db617957f24b5df645', '2025-08-27 19:16:21', '2025-08-26 17:16:21', '2025-08-26 17:16:21'),
(111, 47, 'c648ce7dbf555c06a10a31e29eecc52becbad2ad174156d579f6bf388169ed9c', '2025-08-27 19:18:26', '2025-08-26 17:18:26', '2025-08-26 17:18:26'),
(112, 62, '22a3deae4939a44f360182123b6af54518ad9f5f6bd526eca6232f114f6b407e', '2025-08-27 19:31:16', '2025-08-26 17:31:16', '2025-08-26 17:31:16'),
(113, 47, '89253466974675b8733a40c650f798bf73a257f289b70a5056a41de72cdda8f0', '2025-08-27 19:33:09', '2025-08-26 17:33:09', '2025-08-26 17:33:09'),
(114, 62, '1a8039576ed8672afdc798bf7454931fc19c26c8819ee567e9036adb05fa1844', '2025-08-27 19:33:25', '2025-08-26 17:33:25', '2025-08-26 17:33:25'),
(115, 130, '3383e173090f6e2a69cd48424843b025e0f5214d4e0a596517ad6fe177454db6', '2025-08-27 19:35:37', '2025-08-26 17:35:37', '2025-08-26 17:35:37'),
(116, 47, 'e38d6e4f0fd3c845f17ceacbc1dc209d41fadf3e795f272c0a948ec2d0836084', '2025-08-27 19:43:53', '2025-08-26 17:43:53', '2025-08-26 17:43:53'),
(117, 62, '368b4feba1bbe9ac9d2142979d8aa8b845e52d7b7e0cdaefb0299df887e0190e', '2025-08-27 20:11:51', '2025-08-26 18:11:51', '2025-08-26 18:11:51'),
(118, 62, '6d76acd147a0d8b3a193998115d2eec46fa55b8eb9a67839bbd496ab878eb637', '2025-08-27 21:03:20', '2025-08-26 19:03:20', '2025-08-26 19:03:20'),
(119, 62, 'b2731509b1f4b9b908a0e6d8dd16de969e41df1b586717947d2bc823ef16c176', '2025-08-27 21:11:24', '2025-08-26 19:11:24', '2025-08-26 19:11:24'),
(120, 62, '86f1a3e1e9351f6a429e7dd74a35ff341b48dd153473e7d1410ea4100c23f503', '2025-08-27 21:18:03', '2025-08-26 19:18:03', '2025-08-26 19:18:03'),
(121, 62, 'b959f67ecb8c102a9487e6c1cb34d4999ab29a3abbad2c7c01707b5b5e5c5a3e', '2025-08-27 21:19:12', '2025-08-26 19:19:12', '2025-08-26 19:19:12'),
(122, 62, '0b4f19da66be854660069b9aab6989f65356450602ff24de0b0f1c70d7c1a025', '2025-08-28 09:30:54', '2025-08-27 07:30:54', '2025-08-27 07:30:54'),
(123, 62, 'db7370deffcac9e231fa2c4e69293c1e5802025c628c7e7ada0b08dd115ff3b9', '2025-08-28 09:32:46', '2025-08-27 07:32:46', '2025-08-27 07:32:46'),
(124, 85, '9ac6312c497523773e65559ac214d11f8c5dd63d2fac9d2777458ab701c84099', '2025-08-28 10:10:17', '2025-08-27 08:10:17', '2025-08-27 08:10:17'),
(125, 85, '885a6d5c053d143d4b4dbf54a245ff1cc250e6397d2fd29b16df6520766efed7', '2025-08-28 10:26:01', '2025-08-27 08:26:01', '2025-08-27 08:26:01'),
(126, 85, 'c2c3badc624fa5f0fe76df8bf6598c205c2e75f4b3c841230aaa31903537e65f', '2025-08-28 10:26:47', '2025-08-27 08:26:47', '2025-08-27 08:26:47'),
(127, 47, 'fa92612e818e3bc69f891228cbb9c5e192655615df304df5a625ea730d115dc5', '2025-08-28 10:27:00', '2025-08-27 08:27:00', '2025-08-27 08:27:00'),
(128, 85, '2dd11d77dfe3c3a64120b9a7506273f8737b70ca6de2207aedb855fcc055609e', '2025-08-28 10:27:18', '2025-08-27 08:27:18', '2025-08-27 08:27:18'),
(129, 85, '3621715f5879bdd6349cfb2feed000e0e44bd1519a11c72d75b90b7996f8dcd1', '2025-08-28 10:34:03', '2025-08-27 08:34:03', '2025-08-27 08:34:03'),
(130, 85, 'cd8ed676051f35d56249e20b081e096b1d08472b4e923061d8320bf287a2d3b2', '2025-08-28 10:44:08', '2025-08-27 08:44:08', '2025-08-27 08:44:08'),
(131, 85, 'feb265a1605dbb47bc208bd7ab623634ff3c4d17b8e49fedda6ef3cdaccc6e83', '2025-08-28 10:44:59', '2025-08-27 08:44:59', '2025-08-27 08:44:59'),
(132, 85, '373570ae3a51cdf889e3827c54b1666933ee82147d225707a3f5f38a7832ad58', '2025-08-28 10:48:58', '2025-08-27 08:48:58', '2025-08-27 08:48:58'),
(133, 85, 'c74dbc40d0ec8f7b58636e83acf1fe0d0fc73c6e0b8e15ff4a416ff29c8fc40e', '2025-08-28 10:56:57', '2025-08-27 08:56:57', '2025-08-27 08:56:57'),
(134, 85, '2eaa81b4da4cb31ed72df94545afdbcc30ccc39fd1e638bbe684f26c138f829b', '2025-08-28 10:58:09', '2025-08-27 08:58:09', '2025-08-27 08:58:09'),
(135, 85, '6450549e1d83088fa7cd059799f0f2db1c9bc880cddba2420265291df4fe63ab', '2025-08-28 11:06:16', '2025-08-27 09:06:16', '2025-08-27 09:06:16'),
(136, 85, '8a93d5e42bd66e3883839d1e2dec423f39f05d3720dfe94534e38f501d1cc324', '2025-08-28 11:07:13', '2025-08-27 09:07:13', '2025-08-27 09:07:13'),
(137, 47, 'a7cfa5439d57cb5663f4a5aa48da4d9fefdc869d02e6e932fb60e4c490958dbd', '2025-08-28 11:44:23', '2025-08-27 09:44:23', '2025-08-27 09:44:23'),
(138, 62, '4f44eaca9a895d9e9e24d1a4b9afd6ae08333a1a637c98e80e3be302a6de589d', '2025-08-28 11:44:48', '2025-08-27 09:44:48', '2025-08-27 09:44:48'),
(139, 85, '064f3445d3388aa07ee0f57930dd8f7dcaf824750ca8cd2fdbe81c93731fa247', '2025-08-28 11:45:04', '2025-08-27 09:45:04', '2025-08-27 09:45:04'),
(140, 62, 'a1a42394631afb31f85d54b69764621d702f01ec58c913bc1a57372ffefa4dfb', '2025-08-28 11:47:52', '2025-08-27 09:47:52', '2025-08-27 09:47:52'),
(141, 62, '4472b498c2897ee24bd990605f36c1691793ac2a1a08c87a51258ac8eb149b77', '2025-08-28 11:51:18', '2025-08-27 09:51:18', '2025-08-27 09:51:18'),
(142, 47, 'd2a76c1a53cfae32e8410ad5a28ad0d34e65c64cf8faa17e700a9444cef91188', '2025-08-28 11:51:33', '2025-08-27 09:51:33', '2025-08-27 09:51:33'),
(143, 62, '70fc197df06c58a77252d9ed8b518a16f77482eaaf58b350b4dd52ad5891743f', '2025-08-28 11:59:50', '2025-08-27 09:59:50', '2025-08-27 09:59:50'),
(144, 85, '91ca6bf496368993986d989024e3b64d9fdd3d50427d3c6549c2bb30f563c6ac', '2025-08-28 12:00:09', '2025-08-27 10:00:09', '2025-08-27 10:00:09'),
(145, 47, 'a096746dbd92a0c4a2330f1e7a9fb34caf651d4c4b87cc0c9f4afd55e69db9c8', '2025-08-28 12:00:31', '2025-08-27 10:00:31', '2025-08-27 10:00:31'),
(146, 62, '93a8a58ae66c4c93da3ff944d01e7aa9a633261802a9e2f48464f2cd712a87fe', '2025-08-28 12:01:15', '2025-08-27 10:01:15', '2025-08-27 10:01:15'),
(147, 62, '90a941e2646aaa537b6480e8ac3d2d75df65eade374225b96bf62475036e9c12', '2025-08-30 08:07:27', '2025-08-29 06:07:27', '2025-08-29 06:07:27'),
(148, 47, 'ed195f9e97c3d001b2c1ae3c76f286a8c41db5fa7c244c91fda3fb3556b9927b', '2025-08-30 08:10:57', '2025-08-29 06:10:57', '2025-08-29 06:10:57'),
(149, 62, 'f1aa62f2dc6dab7e4109499719e4b1fe8433ac81f0651b199a97b11c613e2b12', '2025-08-30 08:12:37', '2025-08-29 06:12:37', '2025-08-29 06:12:37'),
(150, 85, '4af7af46cd15ccf3dbf21f1adeb1dda207e6fd5d385acd0635bbeb3062a2558a', '2025-08-30 08:20:40', '2025-08-29 06:20:40', '2025-08-29 06:20:40'),
(151, 47, 'a03417519cec4e0e8fec8fe4a0464b9099e62c6d75c35265e409d34cfeca2a75', '2025-09-06 06:15:58', '2025-09-05 04:15:58', '2025-09-05 04:15:58'),
(152, 131, 'bf1af303ebde1db7f1f7802dd18a8fe99298a69de2e43838e200369c241499bf', '2025-09-06 06:39:39', '2025-09-05 04:39:39', '2025-09-05 04:39:39'),
(153, 131, 'f82d7db42095ab44a3a26c8939944e30ca187153e27827d3b407048dd5d08384', '2025-09-06 11:38:00', '2025-09-05 09:38:00', '2025-09-05 09:38:00'),
(154, 131, '70dc1e5909653b50b1c1d8a887334a2e081cecbebdc620525240df93c6ebff2d', '2025-09-06 11:51:28', '2025-09-05 09:51:28', '2025-09-05 09:51:28'),
(155, 47, '212cd0c3564aa8e111c612c86032d9c53f5bfd4787c2f379b4de4fd376cd01ba', '2025-09-06 18:40:07', '2025-09-05 16:40:07', '2025-09-05 16:40:07'),
(156, 131, 'c23b594d571396c05755cef1d68a59d66be952903dec8650497188441d2f93be', '2025-09-06 18:44:24', '2025-09-05 16:44:24', '2025-09-05 16:44:24'),
(157, 131, '1dbbf1f8a20f0a04d8aa6ef9ace7aba73702325367978c8abfe895341a434bfb', '2025-09-06 19:29:12', '2025-09-05 17:29:12', '2025-09-05 17:29:12'),
(158, 47, '68690e722ec512d0c8a803c0af1f683c34b0af5d7ae38f7dd9ca738ebd050bd4', '2025-09-06 20:32:15', '2025-09-05 18:32:15', '2025-09-05 18:32:15'),
(159, 47, '3b5ccddf8bd7aaa0828c818e41e9a6fd219ed8b1d80d62c2c20efb2dfae44d50', '2025-09-06 20:35:34', '2025-09-05 18:35:34', '2025-09-05 18:35:34'),
(160, 132, 'c4ed68afef64625afb613bfe691e7c1b28173d19eb83a8518de45ad8572b8cd6', '2025-09-06 20:39:25', '2025-09-05 18:39:25', '2025-09-05 18:39:25'),
(161, 47, '1494d9c61554f652d45b76ae3035dd1375c04f66c9c8551d1edf10757ab04696', '2025-09-06 21:09:31', '2025-09-05 19:09:31', '2025-09-05 19:09:31'),
(162, 131, '3795feb9657712782bfce185c1e7368de26c54cd8de27b5d7b820a7d7665c4ca', '2025-09-06 21:11:33', '2025-09-05 19:11:33', '2025-09-05 19:11:33'),
(163, 47, '1ad9b191849723b6f43eca2e3b07b61205405b08832ebd31c32bf20764f1186c', '2025-09-13 04:10:41', '2025-09-12 02:10:41', '2025-09-12 02:10:41'),
(164, 131, '904546e3236d736430560ee055a5a213fb1fea2365ab2cf8af1696e3c75744dd', '2025-09-13 04:14:50', '2025-09-12 02:14:50', '2025-09-12 02:14:50'),
(165, 131, 'ef6044af72142841c71a3fc006b15547ada995059585f41e3e851190a0748fda', '2025-09-13 04:50:14', '2025-09-12 02:50:14', '2025-09-12 02:50:14'),
(166, 131, '09473e9f68433e258b05295f288dc8e6942a5386089f545db1eb01a31a61e3df', '2025-09-13 05:14:00', '2025-09-12 03:14:00', '2025-09-12 03:14:00'),
(167, 47, '79c3997d07d9570f8ee5d9bbbc56357bcf737cee20b11c6031583ce2bd7ea6d8', '2025-09-13 09:42:26', '2025-09-12 07:42:26', '2025-09-12 07:42:26'),
(168, 47, 'f4dfed8145bf62b299a1dbf76b7176ef87b0e22993ac3ee6a61a41704af07bf2', '2025-09-13 09:43:42', '2025-09-12 07:43:42', '2025-09-12 07:43:42'),
(169, 47, 'af0149e80fe0a8db53c0f0b2b3f6806d065dd0cb09b5269fc0fa1ab919294a56', '2025-09-13 09:45:54', '2025-09-12 07:45:54', '2025-09-12 07:45:54'),
(170, 47, '3290b1eb2110cdcbe45f21832fbb0c39b07a85aea97c4f4161297a987027b42c', '2025-09-13 09:54:49', '2025-09-12 07:54:49', '2025-09-12 07:54:49'),
(171, 47, 'd5fbb7eebf8de37675149a018d9d3824fb0976f6897f354b2dafd0a538abccfc', '2025-09-13 10:00:05', '2025-09-12 08:00:05', '2025-09-12 08:00:05'),
(172, 47, '9e9b969d212d82f44fa68a1513091141fbb2dd92b9c0a8188f202ea4888ec1ed', '2025-09-13 10:02:10', '2025-09-12 08:02:10', '2025-09-12 08:02:10'),
(173, 47, 'bf93446c45e4e945cc1057061bca2bbcbe9499be782fcafc7c798f7c8644f088', '2025-09-13 10:15:48', '2025-09-12 08:15:48', '2025-09-12 08:15:48'),
(174, 131, 'd8d2231904df98364702ae197614cab3b542e9750ab7658b74f86b79029d3fc8', '2025-09-13 10:17:12', '2025-09-12 08:17:12', '2025-09-12 08:17:12'),
(175, 47, 'cc80dff2d26f161d9a0cce3c6c79508d4649d8a8c9003e70cc00567c60ad9455', '2025-09-13 17:43:48', '2025-09-12 15:43:48', '2025-09-12 15:43:48'),
(176, 133, 'da34b568a0fa362403a0247ccefb047cd3a525bf616694ed17b045fa30c61899', '2025-09-14 07:41:18', '2025-09-13 05:41:18', '2025-09-13 05:41:18'),
(177, 134, '7c67cb90345443c295507736e09228ba076f35a93e9432c606860dd5ffa6b2c0', '2025-09-14 08:54:19', '2025-09-13 06:54:19', '2025-09-13 06:54:19'),
(178, 135, '7476350dcefad42a30c4e3885781ee5cb90d5a58434d88f95f98ac22a368c559', '2025-09-14 09:14:14', '2025-09-13 07:14:14', '2025-09-13 07:14:14');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `admin_action`
--
ALTER TABLE `admin_action`
  ADD PRIMARY KEY (`action_id`),
  ADD KEY `admin_id` (`admin_id`),
  ADD KEY `target_user_id` (`target_user_id`);

--
-- Indexes for table `attraction_place`
--
ALTER TABLE `attraction_place`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `traveler_id` (`traveler_id`),
  ADD KEY `driver_id` (`driver_id`),
  ADD KEY `guide_id` (`guide_id`),
  ADD KEY `route_id` (`route_id`);

--
-- Indexes for table `drivers`
--
ALTER TABLE `drivers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `guides`
--
ALTER TABLE `guides`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_token` (`token`),
  ADD KEY `idx_otp` (`otp`),
  ADD KEY `idx_expires` (`expires_at`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `booking_id` (`booking_id`);

--
-- Indexes for table `ratings_review`
--
ALTER TABLE `ratings_review`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `reviewed_user_id` (`reviewed_user_id`);

--
-- Indexes for table `routes`
--
ALTER TABLE `routes`
  ADD PRIMARY KEY (`route_id`);

--
-- Indexes for table `travellers`
--
ALTER TABLE `travellers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `trips`
--
ALTER TABLE `trips`
  ADD PRIMARY KEY (`trip_id`),
  ADD KEY `traveler_id` (`traveler_id`),
  ADD KEY `driver_id` (`driver_id`),
  ADD KEY `guide_id` (`guide_id`),
  ADD KEY `route_id` (`route_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `session_token` (`session_token`),
  ADD KEY `idx_session_token` (`session_token`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_expires_at` (`expires_at`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `admin_action`
--
ALTER TABLE `admin_action`
  MODIFY `action_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `attraction_place`
--
ALTER TABLE `attraction_place`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `drivers`
--
ALTER TABLE `drivers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `guides`
--
ALTER TABLE `guides`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ratings_review`
--
ALTER TABLE `ratings_review`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `routes`
--
ALTER TABLE `routes`
  MODIFY `route_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `travellers`
--
ALTER TABLE `travellers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `trips`
--
ALTER TABLE `trips`
  MODIFY `trip_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=136;

--
-- AUTO_INCREMENT for table `user_sessions`
--
ALTER TABLE `user_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=179;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admins`
--
ALTER TABLE `admins`
  ADD CONSTRAINT `admins_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `admin_action`
--
ALTER TABLE `admin_action`
  ADD CONSTRAINT `admin_action_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `admin_action_ibfk_2` FOREIGN KEY (`target_user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`user_id`),
  ADD CONSTRAINT `booking_ibfk_3` FOREIGN KEY (`guide_id`) REFERENCES `guides` (`user_id`),
  ADD CONSTRAINT `booking_ibfk_4` FOREIGN KEY (`route_id`) REFERENCES `routes` (`route_id`);

--
-- Constraints for table `drivers`
--
ALTER TABLE `drivers`
  ADD CONSTRAINT `drivers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `guides`
--
ALTER TABLE `guides`
  ADD CONSTRAINT `guides_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`booking_id`);

--
-- Constraints for table `ratings_review`
--
ALTER TABLE `ratings_review`
  ADD CONSTRAINT `ratings_review_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`booking_id`),
  ADD CONSTRAINT `ratings_review_ibfk_2` FOREIGN KEY (`reviewed_user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `travellers`
--
ALTER TABLE `travellers`
  ADD CONSTRAINT `travellers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `trips`
--
ALTER TABLE `trips`
  ADD CONSTRAINT `trips_ibfk_1` FOREIGN KEY (`traveler_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `trips_ibfk_2` FOREIGN KEY (`driver_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `trips_ibfk_3` FOREIGN KEY (`guide_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `trips_ibfk_4` FOREIGN KEY (`route_id`) REFERENCES `routes` (`route_id`);

--
-- Constraints for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
