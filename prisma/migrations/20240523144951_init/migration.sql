/*
  Warnings:

  - Made the column `task_status_id` on table `task` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `task_task_status_id_fkey` ON `task`;

-- AlterTable
ALTER TABLE `task` MODIFY `task_status_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `task` ADD CONSTRAINT `task_task_status_id_fkey` FOREIGN KEY (`task_status_id`) REFERENCES `task_status`(`task_status_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
