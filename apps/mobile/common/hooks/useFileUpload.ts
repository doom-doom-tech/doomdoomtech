import {useCallback} from 'react'
import * as FileSystem from 'expo-file-system'
import api, {API_BASE_URL} from "@/common/services/api";

// Example type for your file input
interface DocumentPickerAsset {
    uri: string
    name: string
    mimeType?: string
}

// Example type for the request object
interface UploadFileRequest {
    uuid: string
    type: 'Track' | 'User' | 'Album' | 'Note'
    file: DocumentPickerAsset
    signedURL: string
    totalFiles: number
}

export function useFileUpload() {
    return useCallback(
        async (data: UploadFileRequest) => {
            try {
                const response = await api.post(`${API_BASE_URL}/media/generate-url`, {
                    filename: data.file.name,
                    uuid: data.uuid,
                })

                const {uri: fileURL, name: fileName, mimeType} = data.file
                const contentType = mimeType || 'video/mp4'

                await FileSystem.uploadAsync(response.data, fileURL, {
                    headers: {'Content-Type': contentType},
                    httpMethod: 'PUT',
                })

                await api.post(`${API_BASE_URL}/media/process`, {
                    entityUUID: data.uuid,
                    entityType: 'Track',
                    filePath: `${data.uuid}/raw/${fileName}`,
                    totalFiles: data.totalFiles,
                })
            } catch (error) {
                console.error('Error uploading file:', error)
                throw error
            }
        },
        []
    )
}