-- DropForeignKey
ALTER TABLE "jobs"."applications" DROP CONSTRAINT "applications_job_id_fkey";

-- AddForeignKey
ALTER TABLE "jobs"."applications" ADD CONSTRAINT "applications_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"."jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
