import {Job} from "bullmq";
import {container, singleton} from "tsyringe";
import Singleton from "../../../common/classes/injectables/Singleton";
import {IJob} from "../../../common/types";
import axios from "axios";
import {ITrackBoostService} from "../services/TrackBoostService";

export interface DetermineTrackMetadataPayload {
    trackUUID: string;
    audioURL: string;
}

@singleton()
export class DetermineTrackMetadata extends Singleton implements IJob<DetermineTrackMetadataPayload> {

    public async process(job: Job<DetermineTrackMetadataPayload>): Promise<void> {
        const { trackUUID, audioURL } = job.data;
        try {
            // Call the Firebase function that does sampling and uploads, returns sample URL
            const firebaseFunctionUrl = 'https://sampleaudio-fuovwifv7a-uc.a.run.app/'

            if (!firebaseFunctionUrl) throw new Error("FIREBASE_SAMPLE_FUNCTION_URL not set");

            const response = await axios.post(firebaseFunctionUrl, {
                trackUUID,
                audioURL,
                startTime: 10,
                sampleDuration: 10,
            });

            if (response.status !== 200 || !response.data.url) {
                throw new Error(`Firebase sample function failed or returned invalid response: ${response.status}`);
            }

            const sampleURL = response.data.url;

            // Now call TrackBoostService.metadata with sampleURL
            const trackBoostService = container.resolve<ITrackBoostService>("TrackBoostService");
            await trackBoostService.metadata(trackUUID, sampleURL);

            console.log(`DetermineTrackMetadata job completed for trackUUID ${trackUUID}`);

        } catch (error) {
            console.error(`Error in DetermineTrackMetadata job for trackUUID ${trackUUID}:`, error);
            throw error; // let Bull handle retries/failures
        }
    }
}
DetermineTrackMetadata.register();