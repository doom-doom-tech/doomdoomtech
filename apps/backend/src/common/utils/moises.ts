import {container} from './tsyringe';

// Dynamic import to load the ESM module
async function initializeMoises() {
    const { default: Moises } = await import('moises/sdk');
    return new Moises({ apiKey: process.env.MUSIC_AI_API_KEY as string });
}

// Register with tsyringe
container.register('moises', {
    useFactory: () => initializeMoises(),
});

export default initializeMoises();