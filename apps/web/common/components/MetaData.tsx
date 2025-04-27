import Head from "expo-router/head";
import {ReactElement} from "react";

interface MetaDataProps {
	additionalMetaData?: ReactElement | ReactElement[];
	title?: string;
	description?: string;
	image?: string;
	url?: string;
}

const MetaData = ({
	additionalMetaData,
	title = "DoomDoomTech - Break through the noise",
	description = "DoomDoomTech is the spot for creators, music lovers and stakeholders within the music industry. We offer an innovative way for independent artist to brand themselves and to scout musical talent.",
	image = "https://storage.googleapis.com/ddt-app/assets/images/ddt%20-%20cover.png",
	url = "https://doomdoom.tech",
	}: MetaDataProps) => (
	<Head>
		<title>{title}</title>
		<meta name="description" content={description} />

		{/* Open Graph / Facebook */}
		<meta property="og:type" content="website" />
		<meta property="og:url" content={url} />
		<meta property="og:title" content={title} />
		<meta property="og:description" content={description} />
		<meta property="og:image" content={image} />

		{/* Twitter */}
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:url" content={url} />
		<meta name="twitter:title" content={title} />
		<meta name="twitter:description" content={description} />
		<meta name="twitter:image" content={image} />

		<link rel="shortcut icon" type="image/x-icon" href="/assets/favicon.ico" />

		{additionalMetaData}
	</Head>
);

export default MetaData;