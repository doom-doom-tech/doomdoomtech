import {DecodedCursorInterface, EncodedCursorInterface, PaginateRequestObject, PaginationResult} from "../../types/pagination";

class PaginationHandler {
	/**
	 * Encodes a cursor object into a string for pagination.
	 * Supports backward compatibility with string-based cursors.
	 */
	static encodeCursor(cursor: { offset: number } | string): string {
		if (typeof cursor === 'string') {
			return Buffer.from(JSON.stringify({ cursor })).toString('base64');
		}
		return Buffer.from(JSON.stringify(cursor)).toString('base64');
	}

	/**
	 * Decodes a cursor string into an object.
	 * Supports backward compatibility with string-based cursors.
	 */
	static decodeCursor(cursor: string): { offset: number } | { cursor: string } | null {
		if (!cursor) return null;

		try {
			const decoded = JSON.parse(Buffer.from(cursor, 'base64').toString('utf-8'));
			// Backward compatibility for plain string cursors
			if (typeof decoded === 'string') {
				return { cursor: decoded };
			}
			return decoded;
		} catch (e) {
			console.error('Failed to decode cursor:', e);
			return null;
		}
	}

	/**
	 * Generic paginate function for handling database queries.
	 */
	public static async paginate<Request extends EncodedCursorInterface, Response>(data: PaginateRequestObject<Request, Response>): Promise<PaginationResult<Response>> {
		const requestCursorObject: DecodedCursorInterface | undefined = data.data.cursor
			? JSON.parse(Buffer.from(data.data.cursor, 'base64').toString())
			: undefined

		const [items, meta] = await data.fetchFunction({
			limit: data.pageSize ?? 10,
			after: requestCursorObject?.direction === 'forward' ? requestCursorObject.cursor : undefined,
			before: requestCursorObject?.direction === 'backward' ? requestCursorObject.cursor : undefined,
		})

		const nextCursor = meta.hasNextPage ? Buffer.from(JSON.stringify({
			cursor: meta.endCursor,
			direction: 'forward',
		} as DecodedCursorInterface), 'utf-8').toString('base64') : null

		const previousCursor = meta.hasPreviousPage ? Buffer.from(JSON.stringify({
			cursor: meta.startCursor,
			direction: 'backward'
		} as DecodedCursorInterface), 'utf-8').toString('base64') : null

		return {
			data: items as Array<Response>,
			next_page: nextCursor ?? null,
			prev_page: previousCursor ?? null,
		}
	}
}

export default PaginationHandler