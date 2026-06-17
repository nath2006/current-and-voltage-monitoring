-- CreateTable
CREATE TABLE `readings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `voltage` DOUBLE NOT NULL,
    `current` DOUBLE NOT NULL,
    `power` DOUBLE NOT NULL,
    `energy` DOUBLE NOT NULL,
    `frequency` DOUBLE NOT NULL,
    `pf` DOUBLE NOT NULL,
    `state` ENUM('idle', 'charging_small', 'charging_laptop', 'multi_device') NOT NULL,
    `recorded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `readings_recorded_at_idx`(`recorded_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usage_events` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `state` ENUM('idle', 'charging_small', 'charging_laptop', 'multi_device') NOT NULL,
    `started_at` DATETIME(3) NOT NULL,
    `ended_at` DATETIME(3) NULL,
    `duration_seconds` INTEGER NULL,
    `avg_power` DOUBLE NULL,
    `energy_used` DOUBLE NULL,

    INDEX `usage_events_started_at_idx`(`started_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `daily_summary` (
    `date` DATE NOT NULL,
    `total_energy_kwh` DOUBLE NOT NULL,
    `active_duration_seconds` INTEGER NOT NULL,
    `avg_power` DOUBLE NOT NULL,
    `peak_power` DOUBLE NOT NULL,
    `peak_hour` INTEGER NULL,

    PRIMARY KEY (`date`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
