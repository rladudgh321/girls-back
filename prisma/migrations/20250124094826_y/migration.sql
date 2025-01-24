/*
  Warnings:

  - You are about to drop the column `content` on the `Post` table. All the data in the column will be lost.
  - Added the required column `content3` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "content",
ADD COLUMN     "content1" TEXT,
ADD COLUMN     "content2" TEXT,
ADD COLUMN     "content3" TEXT NOT NULL;
