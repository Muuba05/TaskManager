-- DropForeignKey
ALTER TABLE `log` DROP FOREIGN KEY `log_task_id_fkey`;

-- AddForeignKey
ALTER TABLE `log` ADD CONSTRAINT `log_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `task`(`task_id`) ON DELETE CASCADE ON UPDATE CASCADE;
