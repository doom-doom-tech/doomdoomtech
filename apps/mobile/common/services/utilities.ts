import _ from "lodash";
import {AxiosError} from "axios";
import {UseInfiniteQueryResult, UseQueryResult} from "@tanstack/react-query";
import {DocumentPickerAsset} from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {API_BASE_URL, STORAGE_KEYS} from "@/common/services/api";
import * as FileSystem from "expo-file-system";
import {ImagePickerAsset} from "expo-image-picker";

export const extractItemsFromInfinityQuery = <T>(queryResult: any, entity: string = 'items'): T[] => {
    if(!_.has(queryResult, 'pages')) return []
    return [].concat(...queryResult.pages.map((page: any) => page[entity]));
}


export const wait = (ms: number): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

export const assertInfiniteQuery = (query: UseQueryResult | UseInfiniteQueryResult): query is UseInfiniteQueryResult => {
    return "fetchNextPage" in query;
}

export const formatPositionMillis = (positionMillis: number): string => {
    // Convert milliseconds to total seconds
    const totalSeconds = Math.floor(positionMillis / 1000);

    // Calculate minutes and seconds
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Format minutes and seconds into a string
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export const formatServerErrorResponse = (error: AxiosError): string => {
    const errorMessage: string | boolean = _.get(error, 'response.data.error', false)
    if(errorMessage) return errorMessage as string
    return "Something went wrong.. please try again later"
}

export const pluralOrSingular = (amount: number, word: string): string => {
    return amount === 1 ? word : word + 's'
}

export const toggleSelection = (items: Array<any>, item: any, predicate: (item: any) => any) => {
    const itemId = predicate(item);
    if (_.some(items, currentItem => predicate(currentItem) === itemId)) {
        return _.reject(items, currentItem => predicate(currentItem) === itemId);
    }
    return [...items, item];
};

export const formatTimePassed = (timestamp: number): string  => {
    const now = Date.now();
    const seconds = Math.floor((now - timestamp) / 1000);

    let interval = seconds / 31536000; // 1 year = 31536000 seconds

    if (interval > 1) {
        return Math.floor(interval) + "y";
    }
    interval = seconds / 2592000; // 1 month = 2592000 seconds
    if (interval > 1) {
        return Math.floor(interval) + "m";
    }
    interval = seconds / 604800; // 1 week = 604800 seconds
    if (interval > 1) {
        return Math.floor(interval) + "w";
    }
    interval = seconds / 86400; // 1 day = 86400 seconds
    if (interval > 1) {
        return Math.floor(interval) + "d";
    }
    interval = seconds / 3600; // 1 hour = 3600 seconds
    if (interval > 1) {
        return Math.floor(interval) + "h";
    }
    interval = seconds / 60; // 1 minute = 60 seconds
    if (interval > 1) {
        return Math.floor(interval) + "m";
    }
    return "now";
}

export const convertObjectToQueryParams = (data: Record<string, any>) => {
    const queryParams = new URLSearchParams(Object.fromEntries(
        Object.entries(data)
            .filter(([_, value]) => Boolean(value))  // Filter out falsy values
            .map(([key, value]) => [key, String(value)])
    ));

    return queryParams.toString() ? `?${queryParams.toString()}` : '';
}

export const convertToQueryResult = <T>(data: Array<T>) => ({
    data: data,
    isError: false,
    refetch: _.noop,
    isLoading: false,
    isRefetching: false,
}) as UseQueryResult<Array<T>, any>

export const convertToInfiniteQueryResult = <T>(data: Array<T>) => ({
    data: {
        pages: [{ cursor: null, items: data, previous: null }],
        pageParams: []
    },
    refetch: async () => {},
    isError: false,
    isLoading: false,
    isFetchingMore: false,
    hasNextPage: false,
    fetchMore: _.noop,
    canFetchMore: false
}) as unknown as UseInfiniteQueryResult<T, any>


export const extractTypeFromMimetype = (mimetype: string): "File" | "Video" | "Image" => {
    const mimeType = mimetype.toLowerCase();

    switch (true) {
        case mimetype.toLowerCase().startsWith('image/'):
            return 'Image';

        case mimetype.toLowerCase().startsWith('video/'):
            return 'Video';

        case mimetype.toLowerCase().startsWith('application/') || mimeType.startsWith('text/'):
            return 'File';

        default: return 'Image';
    }
}

export const uploadFile = async (file: DocumentPickerAsset | ImagePickerAsset, uuid: string, purpose: string) => {
    try {
        const bearer = await AsyncStorage.getItem(STORAGE_KEYS.AUTH)

        const endpoint = `/media/upload?uuid=${uuid}&purpose=${purpose}`

        const response = await FileSystem.uploadAsync(API_BASE_URL + endpoint, file.uri, {
            httpMethod: 'PUT',
            fieldName: 'file',
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            headers: {
                'Authorization': String(bearer),
                'Content-Type': 'multipart/form-data',
            },
        });

        return _.get(JSON.parse(response.body), 'data.upload.url', '')
    } catch (error) {

    }
}

export function getTimePassedSince(date: Date) {
    // If date is a string, convert it to Date object
    const pastDate = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();

    // Get difference in milliseconds
    const diffMs = now.getTime() - pastDate.getTime();

    // Convert to different time units
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    // Return appropriate string based on time difference
    if (diffSeconds < 60) {
        return `${diffSeconds} second${diffSeconds === 1 ? '' : 's'} ago`;
    } else if (diffMinutes < 60) {
        return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    } else if (diffDays < 7) {
        return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    } else if (diffWeeks < 4) {
        return `${diffWeeks} week${diffWeeks === 1 ? '' : 's'} ago`;
    } else if (diffMonths < 12) {
        return `${diffMonths} month${diffMonths === 1 ? '' : 's'} ago`;
    } else {
        return `${diffYears} year${diffYears === 1 ? '' : 's'} ago`;
    }
}

export const formatReadableDate = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}`;
};

export const secondsToTimeFormat = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}