/*
  Warnings:

  - A unique constraint covering the columns `[listID,trackID]` on the table `list_tracks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "list_tracks_listID_trackID_key" ON "list_tracks"("listID", "trackID");
