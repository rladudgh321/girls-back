/*
  Warnings:

  - The primary key for the `Post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PostTag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Tag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostTag" DROP CONSTRAINT "PostTag_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostTag" DROP CONSTRAINT "PostTag_tagId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP CONSTRAINT "Post_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Post_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Post_id_seq";

-- AlterTable
ALTER TABLE "PostTag" DROP CONSTRAINT "PostTag_pkey",
ALTER COLUMN "postId" SET DATA TYPE TEXT,
ALTER COLUMN "tagId" SET DATA TYPE TEXT,
ADD CONSTRAINT "PostTag_pkey" PRIMARY KEY ("postId", "tagId");

-- AlterTable
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Tag_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Tag_id_seq";

-- DropTable
DROP TABLE "Image";

-- CreateTable
CREATE TABLE "Image1" (
    "id" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "Image1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image2" (
    "id" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "Image2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image3" (
    "id" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "Image3_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PostTag" ADD CONSTRAINT "PostTag_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostTag" ADD CONSTRAINT "PostTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image1" ADD CONSTRAINT "Image1_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image2" ADD CONSTRAINT "Image2_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image3" ADD CONSTRAINT "Image3_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
