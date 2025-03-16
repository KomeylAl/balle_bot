/*
  Warnings:

  - The primary key for the `Fund` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fundId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[chatId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adminId` to the `Fund` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Loan" DROP CONSTRAINT "Loan_fundId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_fundId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_fundId_fkey";

-- AlterTable
ALTER TABLE "Fund" DROP CONSTRAINT "Fund_pkey",
ADD COLUMN     "adminId" INTEGER NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Fund_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Fund_id_seq";

-- AlterTable
ALTER TABLE "Loan" ALTER COLUMN "fundId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "fundId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "fundId";

-- CreateTable
CREATE TABLE "FundMembership" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "fundId" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FundMembership_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_chatId_key" ON "User"("chatId");

-- AddForeignKey
ALTER TABLE "Fund" ADD CONSTRAINT "Fund_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundMembership" ADD CONSTRAINT "FundMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundMembership" ADD CONSTRAINT "FundMembership_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "Fund"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "Fund"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "Fund"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
