-- CreateTable
CREATE TABLE "_BaseSharedUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BaseSharedUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_WorkspaceSharedUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_WorkspaceSharedUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BaseSharedUsers_B_index" ON "_BaseSharedUsers"("B");

-- CreateIndex
CREATE INDEX "_WorkspaceSharedUsers_B_index" ON "_WorkspaceSharedUsers"("B");

-- AddForeignKey
ALTER TABLE "_BaseSharedUsers" ADD CONSTRAINT "_BaseSharedUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Base"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BaseSharedUsers" ADD CONSTRAINT "_BaseSharedUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkspaceSharedUsers" ADD CONSTRAINT "_WorkspaceSharedUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkspaceSharedUsers" ADD CONSTRAINT "_WorkspaceSharedUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "WorkSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
