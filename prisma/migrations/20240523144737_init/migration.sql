-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `task_task_status_id_fkey`;

-- AlterTable
ALTER TABLE `task` MODIFY `task_status_id` INTEGER NULL;
