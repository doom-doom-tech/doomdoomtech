import {singleton} from "tsyringe";
import {container} from "../../../common/utils/tsyringe";
import {ITrackScoringService} from "../services/TrackScoringService";
import Singleton from "../../../common/classes/injectables/Singleton";
import {IJob} from "../../../common/types";

@singleton()
export class ComputeTrackScoresJob extends Singleton implements IJob {
    public async process(): Promise<void> {
        const trackScoreService = container.resolve<ITrackScoringService>("TrackScoringService")

        try {
            await trackScoreService.computeBestRatedScore()
            await trackScoreService.computePopularityScore()
        } catch (error) {
            console.error("Error computing track scores:", error);
            throw new Error("Failed to process track scores");
        }
    }
}

ComputeTrackScoresJob.register()