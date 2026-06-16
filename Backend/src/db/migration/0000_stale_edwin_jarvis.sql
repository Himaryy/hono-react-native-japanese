CREATE TABLE "friend_codes" (
	"code" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "friend_codes_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "friendships" (
	"user_id_1" text NOT NULL,
	"user_id_2" text NOT NULL,
	"added_at" timestamp DEFAULT now(),
	"status" text DEFAULT 'active',
	CONSTRAINT "friendships_user_id_1_user_id_2_pk" PRIMARY KEY("user_id_1","user_id_2")
);
--> statement-breakpoint
CREATE TABLE "review_items" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"content_id" text NOT NULL,
	"next_review_date" timestamp NOT NULL,
	"repetitions" integer DEFAULT 0,
	"interval" integer DEFAULT 1,
	"easy_factor" real DEFAULT 2.5,
	"last_reviewed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"user_id" text PRIMARY KEY NOT NULL,
	"jlpt_level" text DEFAULT 'N5',
	"current_day" integer DEFAULT 1,
	"total_kanji_learned" integer DEFAULT 0,
	"total_vocab_learned" integer DEFAULT 0,
	"current_streak" integer DEFAULT 0,
	"longest_streak" integer DEFAULT 0,
	"last_studied_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_progress" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"day" integer NOT NULL,
	"completed" boolean DEFAULT false,
	"completed_at" timestamp,
	"time_spent_minutes" integer,
	"items_mastered_count" integer
);
