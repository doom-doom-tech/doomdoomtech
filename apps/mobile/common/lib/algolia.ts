import {algoliasearch} from "algoliasearch";

const insights = algoliasearch('ALGOLIA_APPLICATION_ID', 'ALGOLIA_API_KEY')
    .initInsights({ region: 'us' });

export { insights };