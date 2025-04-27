import {AxiosInstance} from "axios";
import _ from "lodash";

export interface PaginatedQueryRequest {
	url: string;
	entityKey: string;
	class: any;
	cursor?: string | null;
}

export interface PaginatedQueryResponse<T> {
	items: T[];
	next_page: string | null;
	prev_page: string | null;
}

export const buildPaginatedQuery = async <T>(
	api: AxiosInstance,
	config: PaginatedQueryRequest | ((data: any) => PaginatedQueryRequest),
	accept404?: boolean
): Promise<PaginatedQueryResponse<T>> => {
	const getConfig = (data: any) => (typeof config === 'function' ? config(data) : config);

	const initialConfig = getConfig({});
	const response = !!initialConfig.cursor
		? await api.get(`${initialConfig.url}${_.includes(initialConfig.url, '?') ? '&' : '?'}cursor=${initialConfig.cursor}`, {
			validateStatus: (status) => (accept404 ? (status >= 200 && status < 300) || status === 404 : status >= 200 && status < 300)
		})
		: await api.get(`${initialConfig.url}`, {
			validateStatus: (status) => (accept404 ? (status >= 200 && status < 300) || status === 404 : status >= 200 && status < 300)
		});

	if (response.status === 404 && accept404) {
		return {
			items: [] as Array<T>,
			next_page: null,
			prev_page: null
		};
	}

	const responseData = _.get(response, `data.data.${initialConfig.entityKey}.data`);
	const items = responseData.map((item: any) => {
		const dynamicConfig = getConfig(item);
		return new dynamicConfig.class(item);
	});

	return {
		items,
		prev_page: _.get(response, `data.data.${initialConfig.entityKey}.prev_page`),
		next_page: _.get(response, `data.data.${initialConfig.entityKey}.next_page`),
	};
};