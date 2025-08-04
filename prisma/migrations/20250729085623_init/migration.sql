/*
  Warnings:

  - You are about to drop the column `content` on the `task` table. All the data in the column will be lost.
  - Added the required column `description` to the `CalendarEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `CalendarEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `calendarevent` ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `task` DROP COLUMN `content`,
    ADD COLUMN `title` VARCHAR(191) NOT NULL;
