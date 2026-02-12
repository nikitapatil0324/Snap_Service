CREATE TABLE IF NOT EXISTS `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `booking_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `provider_id` int DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `razorpay_order_id` varchar(255) NOT NULL,
  `razorpay_payment_id` varchar(255) NOT NULL,
  `payment_status` varchar(50) DEFAULT 'SUCCESS',
  `payment_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Optional: Update bookings table to add payment_status if not exists or if checking for it
-- ALTER TABLE `bookings` ADD COLUMN `payment_status` VARCHAR(50) DEFAULT 'PENDING';
