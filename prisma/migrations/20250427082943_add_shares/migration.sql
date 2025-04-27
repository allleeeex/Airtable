-- CreateTable
CREATE TABLE "_BasePendingUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BasePendingUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_WorkpacePendingUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_WorkpacePendingUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BasePendingUsers_B_index" ON "_BasePendingUsers"("B");

-- CreateIndex
CREATE INDEX "_WorkpacePendingUsers_B_index" ON "_WorkpacePendingUsers"("B");

-- AddForeignKey
ALTER TABLE "_BasePendingUsers" ADD CONSTRAINT "_BasePendingUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Base"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BasePendingUsers" ADD CONSTRAINT "_BasePendingUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkpacePendingUsers" ADD CONSTRAINT "_WorkpacePendingUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkpacePendingUsers" ADD CONSTRAINT "_WorkpacePendingUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "WorkSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
