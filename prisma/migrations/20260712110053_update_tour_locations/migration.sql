-- AlterTable
ALTER TABLE "Tour" ADD COLUMN     "guides" TEXT[],
ADD COLUMN     "locations" JSONB,
ADD COLUMN     "startLocation" JSONB;
