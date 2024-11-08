-- CreateTable
CREATE TABLE "images" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);
