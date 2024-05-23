-- CreateTable
CREATE TABLE `log` (
    `log_id` INTEGER NOT NULL AUTO_INCREMENT,
    `task_id` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `created_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`log_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `log` ADD CONSTRAINT `log_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `task`(`task_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
