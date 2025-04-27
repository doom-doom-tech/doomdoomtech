import {$Enums} from "@prisma/client";

export default function createNotificationText(action: $Enums.AlertAction, body?: string) {
    switch (action) {
        case $Enums.AlertAction.Like:
            return `liked your comment: `;
        case $Enums.AlertAction.Play:
            return `played your track`;
        case $Enums.AlertAction.Rate:
            return `left a rating for your track`;
        case $Enums.AlertAction.List:
            return `added your track to their DDTop 10`;
        case $Enums.AlertAction.Follow:
            return `started following you`;
        case $Enums.AlertAction.Collab:
            return `requests to collab with you`;
        case $Enums.AlertAction.Upload:
            return `just uploaded a new track. Go check it out!`;
        case $Enums.AlertAction.Comment:
            return `left a comment on your track`;
        case $Enums.AlertAction.Info:
            return body;
        default:
            return `performed an action on your track`;
    }
}