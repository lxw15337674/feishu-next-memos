-- CreateTable
CREATE TABLE "memos" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tags" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "memos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" TEXT NOT NULL,
    "file_token" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "size" INTEGER NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL DEFAULT 'image',
    "url" TEXT NOT NULL DEFAULT '',
    "memo_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "links" (
    "id" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "text" TEXT,
    "memo_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "images_file_token_key" ON "images"("file_token");

-- CreateIndex
CREATE UNIQUE INDEX "links_memo_id_key" ON "links"("memo_id");

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_memo_id_fkey" FOREIGN KEY ("memo_id") REFERENCES "memos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_memo_id_fkey" FOREIGN KEY ("memo_id") REFERENCES "memos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
