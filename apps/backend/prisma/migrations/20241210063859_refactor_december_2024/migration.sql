-- CreateEnum
CREATE TYPE "SocialPlatformType" AS ENUM ('Tiktok', 'Website', 'Twitter', 'Snapchat', 'Facebook', 'Instagram', 'Soundcloud', 'Spotify');

-- CreateEnum
CREATE TYPE "FollowType" AS ENUM ('User');

-- CreateEnum
CREATE TYPE "AlertEntityType" AS ENUM ('User', 'List', 'Track', 'Reply', 'Comment', 'Message');

-- CreateEnum
CREATE TYPE "AlertAction" AS ENUM ('Like', 'Play', 'Rate', 'List', 'Info', 'Share', 'Follow', 'Collab', 'Upload', 'Comment', 'Message');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('Text', 'Track');

-- CreateEnum
CREATE TYPE "TagModel" AS ENUM ('Comment', 'Reply');

-- CreateEnum
CREATE TYPE "LikableEntity" AS ENUM ('Comment', 'Reply');

-- CreateEnum
CREATE TYPE "ReportEntity" AS ENUM ('Comment', 'Track');

-- CreateEnum
CREATE TYPE "DevicePlatformEnum" AS ENUM ('ios', 'android');

-- CreateEnum
CREATE TYPE "PendingJobSlug" AS ENUM ('notify_last_active_new_tracks');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "bio" TEXT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar_url" TEXT,
    "banner_url" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "tracks_count" INTEGER NOT NULL DEFAULT 0,
    "followers_count" INTEGER NOT NULL DEFAULT 0,
    "following_count" INTEGER NOT NULL DEFAULT 0,
    "roleID" INTEGER NOT NULL DEFAULT 1,
    "created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_activity" (
    "userID" INTEGER NOT NULL,
    "last_active" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_activity_pkey" PRIMARY KEY ("userID")
);

-- CreateTable
CREATE TABLE "social_platforms" (
    "type" "SocialPlatformType" NOT NULL,
    "url" TEXT NOT NULL,
    "userID" INTEGER NOT NULL,

    CONSTRAINT "social_platforms_pkey" PRIMARY KEY ("userID","type")
);

-- CreateTable
CREATE TABLE "tracks" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "cover_url" TEXT,
    "audio_url" TEXT,
    "waveform_url" TEXT,
    "caption" TEXT,
    "key" TEXT,
    "bpm" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "total_assets" INTEGER NOT NULL DEFAULT 0,
    "uploaded_assets" INTEGER NOT NULL DEFAULT 0,
    "total_comments_count" INTEGER NOT NULL DEFAULT 0,
    "total_plays_count" INTEGER NOT NULL DEFAULT 0,
    "average_rating" INTEGER NOT NULL DEFAULT 0,
    "main_artist" INTEGER NOT NULL,
    "genreID" INTEGER NOT NULL,
    "created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "track_artists" (
    "trackID" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,

    CONSTRAINT "track_artists_pkey" PRIMARY KEY ("trackID","userID")
);

-- CreateTable
CREATE TABLE "track_interactions" (
    "id" SERIAL NOT NULL,
    "list_count" INTEGER NOT NULL DEFAULT 0,
    "views_count" INTEGER NOT NULL DEFAULT 0,
    "plays_count" INTEGER NOT NULL DEFAULT 0,
    "shares_count" INTEGER NOT NULL DEFAULT 0,
    "ratings_count" INTEGER NOT NULL DEFAULT 0,
    "comments_count" INTEGER NOT NULL DEFAULT 0,
    "trackID" INTEGER NOT NULL,
    "created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "track_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "track_statistics" (
    "id" SERIAL NOT NULL,
    "average_playtime" INTEGER NOT NULL DEFAULT 0,
    "average_list_position" INTEGER NOT NULL DEFAULT 0,
    "average_rating" INTEGER NOT NULL DEFAULT 0,
    "trackID" INTEGER NOT NULL,
    "created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "track_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "track_ratings" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,
    "trackID" INTEGER NOT NULL,
    "created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "track_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "track_views" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "trackID" INTEGER NOT NULL,
    "created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "track_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "track_scores" (
    "id" SERIAL NOT NULL,
    "trackID" INTEGER NOT NULL,
    "day" INTEGER NOT NULL DEFAULT 0,
    "week" INTEGER NOT NULL DEFAULT 0,
    "month" INTEGER NOT NULL DEFAULT 0,
    "overall" INTEGER NOT NULL DEFAULT 0,
    "created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "track_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "track_popularity" (
    "id" SERIAL NOT NULL,
    "trackID" INTEGER NOT NULL,
    "day" INTEGER NOT NULL DEFAULT 0,
    "week" INTEGER NOT NULL DEFAULT 0,
    "month" INTEGER NOT NULL DEFAULT 0,
    "overall" INTEGER NOT NULL DEFAULT 0,
    "created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "track_popularity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collab_requests" (
    "id" SERIAL NOT NULL,
    "senderID" INTEGER NOT NULL,
    "targetID" INTEGER NOT NULL,
    "trackID" INTEGER NOT NULL,
    "created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "collab_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "albums" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userID" INTEGER NOT NULL,
    "created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "album_tracks" (
    "id" SERIAL NOT NULL,
    "position" INTEGER NOT NULL,
    "albumID" INTEGER NOT NULL,
    "trackID" INTEGER NOT NULL,

    CONSTRAINT "album_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notes" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userID" INTEGER NOT NULL,
    "trackID" INTEGER,
    "loop" BOOLEAN NOT NULL DEFAULT false,
    "looperID" INTEGER,
    "created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plays" (
    "id" SERIAL NOT NULL,
    "sessionID" TEXT NOT NULL,
    "trackID" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,
    "created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lists" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,

    CONSTRAINT "lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "list_tracks" (
    "trackID" INTEGER NOT NULL,
    "listID" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "list_tracks_pkey" PRIMARY KEY ("listID","trackID")
);

-- CreateTable
CREATE TABLE "genres" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subgenres" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "genreID" INTEGER NOT NULL,

    CONSTRAINT "subgenres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "roleID" INTEGER NOT NULL,
    "permissionID" INTEGER NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("roleID","permissionID")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follows" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "followsID" INTEGER NOT NULL,
    "type" "FollowType" NOT NULL,
    "created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alerts" (
    "id" SERIAL NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "eventID" INTEGER,
    "targetID" INTEGER NOT NULL,
    "content" TEXT,
    "count" INTEGER NOT NULL DEFAULT 0,
    "action" "AlertAction" NOT NULL,
    "entityID" INTEGER,
    "entityType" "AlertEntityType",
    "created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alert_users" (
    "id" SERIAL NOT NULL,
    "alertID" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,

    CONSTRAINT "alert_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alert_events" (
    "id" SERIAL NOT NULL,
    "event" TEXT NOT NULL,
    "params" TEXT NOT NULL,

    CONSTRAINT "alert_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alert_queue" (
    "alertID" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "type" "MessageType" DEFAULT 'Text',
    "conversationID" INTEGER NOT NULL,
    "entityID" INTEGER,
    "senderID" INTEGER NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_users" (
    "userID" INTEGER NOT NULL,
    "conversationID" INTEGER NOT NULL,

    CONSTRAINT "conversation_users_pkey" PRIMARY KEY ("userID","conversationID")
);

-- CreateTable
CREATE TABLE "active_sockets" (
    "userID" INTEGER NOT NULL,
    "socketID" TEXT NOT NULL,

    CONSTRAINT "active_sockets_pkey" PRIMARY KEY ("userID")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "senderID" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "trackID" INTEGER NOT NULL,
    "created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "replies" (
    "id" SERIAL NOT NULL,
    "senderID" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "parentID" INTEGER NOT NULL,
    "created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "replies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "userID" INTEGER NOT NULL,
    "model" "TagModel" NOT NULL,
    "modelID" INTEGER NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "likes" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "entity" "LikableEntity" NOT NULL,
    "entityID" INTEGER NOT NULL,
    "created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "entity" "ReportEntity" NOT NULL,
    "entityID" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reset_password_tokens" (
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "verify_email_tokens" (
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "devices" (
    "id" SERIAL NOT NULL,
    "push_token" TEXT,
    "device_token" TEXT,
    "expo_device_id" TEXT NOT NULL,
    "platform" "DevicePlatformEnum",
    "userID" INTEGER,
    "created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pending_jobs" (
    "userID" INTEGER NOT NULL,
    "id" TEXT NOT NULL,
    "slug" "PendingJobSlug" NOT NULL,
    "description" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "apple_users" (
    "token" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "blocked_users" (
    "id" SERIAL NOT NULL,
    "blockerID" INTEGER NOT NULL,
    "blockedID" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blocked_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_genres" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "genreID" INTEGER NOT NULL,

    CONSTRAINT "user_genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bug_reports" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "bug_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "failed_jobs" (
    "id" SERIAL NOT NULL,
    "job" TEXT NOT NULL,
    "error" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "failed_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_id_idx" ON "users"("id");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "social_platforms_userID_type_key" ON "social_platforms"("userID", "type");

-- CreateIndex
CREATE INDEX "tracks_key_idx" ON "tracks"("key");

-- CreateIndex
CREATE INDEX "tracks_bpm_idx" ON "tracks"("bpm");

-- CreateIndex
CREATE INDEX "tracks_uuid_idx" ON "tracks"("uuid");

-- CreateIndex
CREATE INDEX "tracks_title_idx" ON "tracks"("title");

-- CreateIndex
CREATE INDEX "tracks_genreID_idx" ON "tracks"("genreID");

-- CreateIndex
CREATE INDEX "tracks_created_idx" ON "tracks"("created");

-- CreateIndex
CREATE INDEX "tracks_main_artist_idx" ON "tracks"("main_artist");

-- CreateIndex
CREATE INDEX "tracks_genreID_created_idx" ON "tracks"("genreID", "created");

-- CreateIndex
CREATE INDEX "track_artists_trackID_idx" ON "track_artists"("trackID");

-- CreateIndex
CREATE INDEX "track_artists_userID_idx" ON "track_artists"("userID");

-- CreateIndex
CREATE INDEX "track_interactions_trackID_idx" ON "track_interactions"("trackID");

-- CreateIndex
CREATE INDEX "track_interactions_created_trackID_idx" ON "track_interactions"("created", "trackID");

-- CreateIndex
CREATE UNIQUE INDEX "track_interactions_created_trackID_key" ON "track_interactions"("created", "trackID");

-- CreateIndex
CREATE INDEX "track_statistics_trackID_idx" ON "track_statistics"("trackID");

-- CreateIndex
CREATE INDEX "track_statistics_created_trackID_idx" ON "track_statistics"("created", "trackID");

-- CreateIndex
CREATE UNIQUE INDEX "track_statistics_created_trackID_key" ON "track_statistics"("created", "trackID");

-- CreateIndex
CREATE INDEX "track_ratings_userID_idx" ON "track_ratings"("userID");

-- CreateIndex
CREATE INDEX "track_ratings_trackID_idx" ON "track_ratings"("trackID");

-- CreateIndex
CREATE INDEX "track_ratings_created_trackID_idx" ON "track_ratings"("created", "trackID");

-- CreateIndex
CREATE UNIQUE INDEX "track_ratings_userID_trackID_key" ON "track_ratings"("userID", "trackID");

-- CreateIndex
CREATE INDEX "track_views_userID_idx" ON "track_views"("userID");

-- CreateIndex
CREATE INDEX "track_views_trackID_idx" ON "track_views"("trackID");

-- CreateIndex
CREATE INDEX "track_views_created_trackID_idx" ON "track_views"("created", "trackID");

-- CreateIndex
CREATE UNIQUE INDEX "track_views_userID_trackID_key" ON "track_views"("userID", "trackID");

-- CreateIndex
CREATE UNIQUE INDEX "track_scores_trackID_key" ON "track_scores"("trackID");

-- CreateIndex
CREATE INDEX "track_scores_trackID_idx" ON "track_scores"("trackID");

-- CreateIndex
CREATE INDEX "track_scores_created_trackID_idx" ON "track_scores"("created", "trackID");

-- CreateIndex
CREATE UNIQUE INDEX "track_popularity_trackID_key" ON "track_popularity"("trackID");

-- CreateIndex
CREATE INDEX "track_popularity_trackID_idx" ON "track_popularity"("trackID");

-- CreateIndex
CREATE INDEX "track_popularity_created_trackID_idx" ON "track_popularity"("created", "trackID");

-- CreateIndex
CREATE INDEX "collab_requests_trackID_idx" ON "collab_requests"("trackID");

-- CreateIndex
CREATE INDEX "collab_requests_targetID_idx" ON "collab_requests"("targetID");

-- CreateIndex
CREATE INDEX "collab_requests_senderID_idx" ON "collab_requests"("senderID");

-- CreateIndex
CREATE UNIQUE INDEX "collab_requests_targetID_trackID_key" ON "collab_requests"("targetID", "trackID");

-- CreateIndex
CREATE INDEX "albums_name_idx" ON "albums"("name");

-- CreateIndex
CREATE INDEX "albums_userID_idx" ON "albums"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "albums_uuid_key" ON "albums"("uuid");

-- CreateIndex
CREATE INDEX "album_tracks_trackID_idx" ON "album_tracks"("trackID");

-- CreateIndex
CREATE INDEX "album_tracks_albumID_idx" ON "album_tracks"("albumID");

-- CreateIndex
CREATE UNIQUE INDEX "album_tracks_albumID_position_key" ON "album_tracks"("albumID", "position");

-- CreateIndex
CREATE INDEX "notes_content_idx" ON "notes"("content");

-- CreateIndex
CREATE INDEX "notes_userID_idx" ON "notes"("userID");

-- CreateIndex
CREATE INDEX "notes_trackID_idx" ON "notes"("trackID");

-- CreateIndex
CREATE INDEX "notes_looperID_idx" ON "notes"("looperID");

-- CreateIndex
CREATE INDEX "plays_userID_idx" ON "plays"("userID");

-- CreateIndex
CREATE INDEX "plays_created_idx" ON "plays"("created");

-- CreateIndex
CREATE INDEX "plays_trackID_idx" ON "plays"("trackID");

-- CreateIndex
CREATE INDEX "plays_sessionID_idx" ON "plays"("sessionID");

-- CreateIndex
CREATE INDEX "plays_sessionID_trackID_userID_idx" ON "plays"("sessionID", "trackID", "userID");

-- CreateIndex
CREATE UNIQUE INDEX "lists_userID_key" ON "lists"("userID");

-- CreateIndex
CREATE INDEX "lists_userID_idx" ON "lists"("userID");

-- CreateIndex
CREATE INDEX "list_tracks_listID_idx" ON "list_tracks"("listID");

-- CreateIndex
CREATE INDEX "list_tracks_trackID_idx" ON "list_tracks"("trackID");

-- CreateIndex
CREATE INDEX "genres_name_idx" ON "genres"("name");

-- CreateIndex
CREATE UNIQUE INDEX "genres_name_key" ON "genres"("name");

-- CreateIndex
CREATE INDEX "subgenres_name_idx" ON "subgenres"("name");

-- CreateIndex
CREATE INDEX "subgenres_genreID_idx" ON "subgenres"("genreID");

-- CreateIndex
CREATE UNIQUE INDEX "subgenres_genreID_name_key" ON "subgenres"("genreID", "name");

-- CreateIndex
CREATE INDEX "follows_userID_idx" ON "follows"("userID");

-- CreateIndex
CREATE INDEX "follows_followsID_idx" ON "follows"("followsID");

-- CreateIndex
CREATE UNIQUE INDEX "follows_userID_followsID_key" ON "follows"("userID", "followsID");

-- CreateIndex
CREATE INDEX "alerts_targetID_idx" ON "alerts"("targetID");

-- CreateIndex
CREATE INDEX "alerts_targetID_created_idx" ON "alerts"("targetID", "created");

-- CreateIndex
CREATE UNIQUE INDEX "alerts_action_entityType_entityID_targetID_key" ON "alerts"("action", "entityType", "entityID", "targetID");

-- CreateIndex
CREATE UNIQUE INDEX "alert_users_alertID_userID_key" ON "alert_users"("alertID", "userID");

-- CreateIndex
CREATE UNIQUE INDEX "alert_queue_alertID_key" ON "alert_queue"("alertID");

-- CreateIndex
CREATE INDEX "messages_conversationID_idx" ON "messages"("conversationID");

-- CreateIndex
CREATE UNIQUE INDEX "reset_password_tokens_email_key" ON "reset_password_tokens"("email");

-- CreateIndex
CREATE UNIQUE INDEX "verify_email_tokens_email_key" ON "verify_email_tokens"("email");

-- CreateIndex
CREATE UNIQUE INDEX "devices_push_token_key" ON "devices"("push_token");

-- CreateIndex
CREATE UNIQUE INDEX "devices_expo_device_id_key" ON "devices"("expo_device_id");

-- CreateIndex
CREATE UNIQUE INDEX "pending_jobs_userID_slug_key" ON "pending_jobs"("userID", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "apple_users_token_email_key" ON "apple_users"("token", "email");

-- CreateIndex
CREATE UNIQUE INDEX "blocked_users_blockerID_blockedID_key" ON "blocked_users"("blockerID", "blockedID");

-- CreateIndex
CREATE INDEX "user_genres_userID_genreID_idx" ON "user_genres"("userID", "genreID");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleID_fkey" FOREIGN KEY ("roleID") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_activity" ADD CONSTRAINT "user_activity_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_platforms" ADD CONSTRAINT "social_platforms_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_genreID_fkey" FOREIGN KEY ("genreID") REFERENCES "subgenres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "track_artists" ADD CONSTRAINT "track_artists_trackID_fkey" FOREIGN KEY ("trackID") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "track_artists" ADD CONSTRAINT "track_artists_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "track_interactions" ADD CONSTRAINT "track_interactions_trackID_fkey" FOREIGN KEY ("trackID") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "track_statistics" ADD CONSTRAINT "track_statistics_trackID_fkey" FOREIGN KEY ("trackID") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "track_ratings" ADD CONSTRAINT "track_ratings_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "track_ratings" ADD CONSTRAINT "track_ratings_trackID_fkey" FOREIGN KEY ("trackID") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "track_views" ADD CONSTRAINT "track_views_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "track_views" ADD CONSTRAINT "track_views_trackID_fkey" FOREIGN KEY ("trackID") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "track_scores" ADD CONSTRAINT "track_scores_trackID_fkey" FOREIGN KEY ("trackID") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "track_popularity" ADD CONSTRAINT "track_popularity_trackID_fkey" FOREIGN KEY ("trackID") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collab_requests" ADD CONSTRAINT "collab_requests_senderID_fkey" FOREIGN KEY ("senderID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collab_requests" ADD CONSTRAINT "collab_requests_targetID_fkey" FOREIGN KEY ("targetID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collab_requests" ADD CONSTRAINT "collab_requests_trackID_fkey" FOREIGN KEY ("trackID") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "albums" ADD CONSTRAINT "albums_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "album_tracks" ADD CONSTRAINT "album_tracks_albumID_fkey" FOREIGN KEY ("albumID") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "album_tracks" ADD CONSTRAINT "album_tracks_trackID_fkey" FOREIGN KEY ("trackID") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_trackID_fkey" FOREIGN KEY ("trackID") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_looperID_fkey" FOREIGN KEY ("looperID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lists" ADD CONSTRAINT "lists_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_tracks" ADD CONSTRAINT "list_tracks_trackID_fkey" FOREIGN KEY ("trackID") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_tracks" ADD CONSTRAINT "list_tracks_listID_fkey" FOREIGN KEY ("listID") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subgenres" ADD CONSTRAINT "subgenres_genreID_fkey" FOREIGN KEY ("genreID") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleID_fkey" FOREIGN KEY ("roleID") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionID_fkey" FOREIGN KEY ("permissionID") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_followsID_fkey" FOREIGN KEY ("followsID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_eventID_fkey" FOREIGN KEY ("eventID") REFERENCES "alert_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_targetID_fkey" FOREIGN KEY ("targetID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_users" ADD CONSTRAINT "alert_users_alertID_fkey" FOREIGN KEY ("alertID") REFERENCES "alerts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_users" ADD CONSTRAINT "alert_users_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_queue" ADD CONSTRAINT "alert_queue_alertID_fkey" FOREIGN KEY ("alertID") REFERENCES "alerts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationID_fkey" FOREIGN KEY ("conversationID") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderID_fkey" FOREIGN KEY ("senderID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_users" ADD CONSTRAINT "conversation_users_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_users" ADD CONSTRAINT "conversation_users_conversationID_fkey" FOREIGN KEY ("conversationID") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_senderID_fkey" FOREIGN KEY ("senderID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_trackID_fkey" FOREIGN KEY ("trackID") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_senderID_fkey" FOREIGN KEY ("senderID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_parentID_fkey" FOREIGN KEY ("parentID") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pending_jobs" ADD CONSTRAINT "pending_jobs_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocked_users" ADD CONSTRAINT "blocked_users_blockerID_fkey" FOREIGN KEY ("blockerID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocked_users" ADD CONSTRAINT "blocked_users_blockedID_fkey" FOREIGN KEY ("blockedID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_genres" ADD CONSTRAINT "user_genres_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_genres" ADD CONSTRAINT "user_genres_genreID_fkey" FOREIGN KEY ("genreID") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;
