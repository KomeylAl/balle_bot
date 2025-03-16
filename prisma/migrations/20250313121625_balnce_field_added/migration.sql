-- AlterTable
ALTER TABLE "Fund" ADD COLUMN     "balance" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "FundMembership" ADD COLUMN     "balance" DECIMAL(65,30) NOT NULL DEFAULT 0;
