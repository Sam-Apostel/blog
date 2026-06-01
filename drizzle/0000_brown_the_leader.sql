CREATE TYPE "public"."mode" AS ENUM('software', 'lifestyle', 'hardware');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"hook" text DEFAULT '' NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"mode" "mode" DEFAULT 'software' NOT NULL,
	"cover" text,
	"canonical" text,
	"keywords" text[] DEFAULT '{}' NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "post_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "project" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"content" text,
	"url" text,
	"repo" text,
	"mode" "mode" DEFAULT 'software' NOT NULL,
	"show_url" boolean DEFAULT true NOT NULL,
	"dedicated_page" boolean DEFAULT false NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "project_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "reading_item" (
	"id" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"author" text,
	"source" text,
	"note" text,
	"mode" "mode" DEFAULT 'software' NOT NULL,
	"favorite" boolean DEFAULT false NOT NULL,
	"added_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "release" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"version" text NOT NULL,
	"title" text,
	"notes" text DEFAULT '' NOT NULL,
	"url" text,
	"kind" text DEFAULT 'feature' NOT NULL,
	"released_at" timestamp NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"role" text DEFAULT 'reader' NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "release" ADD CONSTRAINT "release_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "post_mode_idx" ON "post" USING btree ("mode");--> statement-breakpoint
CREATE INDEX "post_published_idx" ON "post" USING btree ("published_at");--> statement-breakpoint
CREATE UNIQUE INDEX "reading_url_idx" ON "reading_item" USING btree ("url");--> statement-breakpoint
CREATE INDEX "reading_mode_idx" ON "reading_item" USING btree ("mode");--> statement-breakpoint
CREATE UNIQUE INDEX "release_project_version_idx" ON "release" USING btree ("project_id","version");--> statement-breakpoint
CREATE INDEX "release_released_idx" ON "release" USING btree ("released_at");