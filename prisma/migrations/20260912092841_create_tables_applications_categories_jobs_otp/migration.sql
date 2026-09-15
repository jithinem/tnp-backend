-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "jobs";

-- CreateEnum
CREATE TYPE "jobs"."ApplicationStatus" AS ENUM ('PENDING', 'SHORTLISTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "users"."OtpPurpose" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET', 'LOGIN');

-- CreateTable
CREATE TABLE "jobs"."applications" (
    "id" SERIAL NOT NULL,
    "job_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "cover_letter" TEXT,
    "status" "jobs"."ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs"."categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs"."jobs" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "salary_min" DECIMAL(65,30),
    "salary_max" DECIMAL(65,30),
    "experience_level" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "employment_type" TEXT NOT NULL,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users"."otps" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "email" TEXT,
    "phone" TEXT,
    "otp_hash" TEXT NOT NULL,
    "purpose" "users"."OtpPurpose" NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "verified_at" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "applications_job_id_idx" ON "jobs"."applications"("job_id");

-- CreateIndex
CREATE INDEX "applications_user_id_idx" ON "jobs"."applications"("user_id");

-- CreateIndex
CREATE INDEX "applications_status_idx" ON "jobs"."applications"("status");

-- CreateIndex
CREATE INDEX "applications_applied_at_idx" ON "jobs"."applications"("applied_at");

-- CreateIndex
CREATE UNIQUE INDEX "applications_job_id_user_id_key" ON "jobs"."applications"("job_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "jobs"."categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "jobs"."categories"("slug");

-- CreateIndex
CREATE INDEX "jobs_category_id_idx" ON "jobs"."jobs"("category_id");

-- CreateIndex
CREATE INDEX "jobs_is_active_idx" ON "jobs"."jobs"("is_active");

-- CreateIndex
CREATE INDEX "jobs_is_featured_idx" ON "jobs"."jobs"("is_featured");

-- CreateIndex
CREATE INDEX "jobs_created_at_idx" ON "jobs"."jobs"("created_at");

-- CreateIndex
CREATE INDEX "otps_user_id_idx" ON "users"."otps"("user_id");

-- CreateIndex
CREATE INDEX "otps_email_idx" ON "users"."otps"("email");

-- CreateIndex
CREATE INDEX "otps_phone_idx" ON "users"."otps"("phone");

-- CreateIndex
CREATE INDEX "otps_expires_at_idx" ON "users"."otps"("expires_at");

-- AddForeignKey
ALTER TABLE "jobs"."applications" ADD CONSTRAINT "applications_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"."jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs"."jobs" ADD CONSTRAINT "jobs_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "jobs"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users"."otps" ADD CONSTRAINT "otps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
