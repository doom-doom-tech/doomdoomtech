import {CursorPaginationMeta} from "prisma-extension-pagination";

export interface EncodedCursorInterface {
	cursor: string
}

export interface DecodedCursorInterface {
	cursor: string
	direction: 'forward' | 'backward'
}

export interface PaginationMeta {
	hasNextPage: boolean
	hasPreviousPage: boolean
	startCursor?: string
	endCursor?: string
}

export interface PaginationResult<T> {
	data: Array<T>
	next_page: string | null
	prev_page: string | null
}

export interface PaginateParams {
	limit: number
	after?: string
	before?: string
}

export interface PaginateRequestObject<Request, Response> {
	fetchFunction: (params: PaginateParams) => Promise<[Array<Response>, CursorPaginationMeta]>
	data: Request
	pageSize: number
}