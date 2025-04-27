import {useMutation} from "@tanstack/react-query";
import api from "@/common/services/api";
import _ from "lodash";
import Album from "@/features/album/classes/Album";
import {CreateAlbumRequest} from "@/features/album/types";

const createAlbum = async (data: CreateAlbumRequest) => {
    const response = await api.post('/album', data)
    return new Album(_.get(response, 'data.data.album'))
}

const useAlbumCreate = () => useMutation({
    mutationFn: (data: CreateAlbumRequest) => createAlbum(data)
})

export default useAlbumCreate