import {TrackInterface} from "@/features/track/types";

export const mockTrackData = {
    "id": 9,
    "uuid": "116968e0-10cb-47b5-898c-5b12995f5443",
    "title": "Bad Dreams",
    "rated": false,
    "added": false,
    "main_artist": 32,
    "cover_url": "https://i.ibb.co/DQZfVtH/image.png",
    "audio_url": "https://storage.googleapis.com/ddt-app/9dea2dda-6861-4b3b-8dce-c20eb4e8c9a1/audio.mp3",
    "waveform_url": "https://storage.googleapis.com/ddt-app/116968e0-10cb-47b5-898c-5b12995f5443/waveform.json?GoogleAccessId=cloud-storage-dev%40prj-d-pwa-8b7a.iam.gserviceaccount.com&Expires=2524604400&Signature=Q5mgrZjAQVSdP%2FqygH4fHEIrHX0n4zQfbtf23l6Npfctgdf3IMbzj3JsgTjPgiaiXIo79jNa%2BGW2xm7inmL83c%2FECb8pqvegOcCl6DUeYrodk3KUm0KT4ijN7Vcl0rBfBmjQD%2B5cPgX%2B%2BDbQ3XDuQ6rz1gcPk6Hugkt4x5rv08%2FXVGPkgbAsTh2E4Mm0In1Wwb%2B7vvwCysUlVpq8hGOdR2Ao%2B2OJ75B21lNB2GHPwIV3%2BfEpFUJLAQZyd4OHpVjweJRr1mFyCHlxh%2Bn4%2FsYEi4O4tARbrzAKuOvhJwKI4hDJ%2B5aON9zAIfAplIc0wYnLnEAPKAlZxG1sRLh6CCYheQ%3D%3D",
    "average_rating": 0,
    "comments_count": 0,
    "bpm": 128,
    "key" : "GMinor",
    "caption": "Sun is going down, time is running out No one else around but me. Steady losing light. Steady losing my mind.",
    "artists": [
        {
            "id": 32,
            "uuid": "39a7494d-39f7-4a2a-8349-5dd34fa1b393",
            "username": "Teddy Swims",
            "verified": false,
            "following": true,
            "tracks_count": 0,
            "avatar_url": "https://plus.unsplash.com/premium_photo-1689530775582-83b8abdb5020?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmFuZG9tJTIwcGVyc29ufGVufDB8fDB8fHww"
        }
    ],
    "genre": {
        "id": 1,
        "name": "Dance"
    },
    "subgenre": {
        "id": 1,
        "name": "Deep House",
        "group": "House"
    },
    "comments" : [
        {
            "id": 1,
            "likes": 1,
            "liked": true,
            "content": "Keihard bro",
            "created": new Date(),
            "deleted": false,
            "parentID": 1,
            "sender": {
                "id": 225,
                "uuid": "e6fca62a-2517-4c2f-a46b-2250e4e532a5",
                "avatar_url" : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoxhWhE-B-k-QyHV4_FSNwV9KX-0ir59AEWQ&s",
                "verified": false,
                "username": "dripd",
                "tracks_count": 6,
                "following": false
            },
        },
        {
            "id": 2,
            "likes": 1,
            "liked": true,
            "content": "Sickkkk",
            "created": new Date(),
            "deleted": false,
            "parentID": 1,
            "sender": {
                "id": 225,
                "uuid": "e6fca62a-2517-4c2f-a46b-2250e4e532a5",
                "avatar_url" : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoxhWhE-B-k-QyHV4_FSNwV9KX-0ir59AEWQ&s",
                "verified": false,
                "username": "dripd",
                "tracks_count": 6,
                "following": false
            },
        }
    ],
    "statistics": [
        {
            "type": "ratings",
            "count": 41,
            "users": []
        },
        {
            "type": "plays",
            "count": 49,
            "users": []
        },
        {
            "type": "list",
            "count": 9,
            "users": [
                {
                    "id": 225,
                    "uuid": "e6fca62a-2517-4c2f-a46b-2250e4e532a5",
                    "avatar_url" : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoxhWhE-B-k-QyHV4_FSNwV9KX-0ir59AEWQ&s",
                    "verified": false,
                    "username": "dripd",
                    "tracks_count": 6,
                    "following": false
                }
            ]
        }
    ]
} as TrackInterface