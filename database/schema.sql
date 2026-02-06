-- Revised Studio CRM Database Schema
-- Updated: 2026-01-20 (Added Client Portal & Technical Logs)

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Table: staff (Unchanged)
CREATE TABLE IF NOT EXISTS `staff` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_uuid` VARCHAR(36) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'manager', 'artist', 'receptionist') NOT NULL DEFAULT 'artist',
  `specialties` TEXT NULL,
  `commission_rate` DECIMAL(5,2) DEFAULT 0.00,
  `active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_unique` (`email` ASC)
) ENGINE = InnoDB;

-- Table: clients (ENHANCED for Portal & Profile)
CREATE TABLE IF NOT EXISTS `clients` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password_hash` VARCHAR(255) NULL COMMENT 'For Client Portal Access',
  `phone` VARCHAR(20) NULL,
  `dob` DATE NULL,
  `address` TEXT NULL,
  `profession` VARCHAR(100) NULL,
  `website` VARCHAR(255) NULL,
  `medical_history` TEXT NULL COMMENT 'Encrypted JSON',
  `allergies` TEXT NULL COMMENT 'Encrypted',
  `photo_url` VARCHAR(255) NULL,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_unique` (`email` ASC)
) ENGINE = InnoDB;

-- Table: appointments (Unchanged)
CREATE TABLE IF NOT EXISTS `appointments` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `client_id` INT UNSIGNED NOT NULL,
  `staff_id` INT UNSIGNED NOT NULL,
  `service_type` ENUM('tattoo', 'piercing', 'consultation', 'touchup', 'removal') NOT NULL,
  `datetime` DATETIME NOT NULL,
  `duration_minutes` INT NOT NULL DEFAULT 60,
  `deposit_amount` DECIMAL(10,2) DEFAULT 0.00,
  `status` ENUM('pending', 'confirmed', 'completed', 'cancelled', 'noshow') NOT NULL DEFAULT 'pending',
  `notes` TEXT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_appt_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Table: services (ENHANCED for Technical Logs)
CREATE TABLE IF NOT EXISTS `services` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `client_id` INT UNSIGNED NOT NULL,
  `staff_id` INT UNSIGNED NOT NULL,
  `appointment_id` INT UNSIGNED NULL,
  `type` ENUM('tattoo', 'piercing', 'touchup', 'removal') NOT NULL,
  `body_location` VARCHAR(100) NOT NULL,
  `machine_tools` TEXT NULL COMMENT 'Machine used / Needle sizes',
  `materials_used` TEXT NULL COMMENT 'Inks, jewelry batches, etc',
  `practitioner_notes` TEXT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `execution_photo_url` VARCHAR(255) NULL,
  `date_completed` DATETIME NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_service_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Table: forms (Disclaimers/Waivers)
CREATE TABLE IF NOT EXISTS `forms` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `client_id` INT UNSIGNED NOT NULL,
  `form_type` ENUM('intake', 'consent', 'aftercare', 'waiver') NOT NULL,
  `data` JSON NOT NULL,
  `signed_at` DATETIME NOT NULL,
  `pdf_path` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_form_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Table: documents (ENHANCED for Vault)
CREATE TABLE IF NOT EXISTS `documents` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `client_id` INT UNSIGNED NULL COMMENT 'Null if it is a studio-wide doc',
  `type` ENUM('id_scan', 'design_reference', 'msds', 'autoclave_log', 'certificate', 'license', 'other') NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255) NULL,
  `uploaded_by_client` TINYINT(1) DEFAULT 0,
  `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- Other tables (Inventory, Financial, Compliance, etc) remain as previously defined

-- Table: gallery_posts (NEW for Studio Gallery)
CREATE TABLE IF NOT EXISTS `gallery_posts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `staff_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `image_path` VARCHAR(255) NOT NULL,
  `tags` VARCHAR(255) NULL COMMENT 'Comma separated keywords',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

SET FOREIGN_KEY_CHECKS = 1;
