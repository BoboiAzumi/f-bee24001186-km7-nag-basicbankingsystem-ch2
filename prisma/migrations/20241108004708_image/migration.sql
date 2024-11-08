/*
  Warnings:

  - Added the required column `user_id` to the `images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "images" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "image_url" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
