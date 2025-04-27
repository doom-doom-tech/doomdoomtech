declare module "*.png" {
	const value: string;
	export default value;
}

declare module "*.webp" {
	const value: string;
	export default value;
}

declare module "*.mp4" {
	const value: string;
	export default value;
}

type Nullable<T> = T | null | undefined;