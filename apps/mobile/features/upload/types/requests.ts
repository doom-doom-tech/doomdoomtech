export interface UploadFileRequest {
    file: any
    uuid: string
    signedURL: string
    fileIndex: number
    totalFiles: number
}