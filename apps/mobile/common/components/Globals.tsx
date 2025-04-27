import React, {Fragment, useCallback, useEffect} from "react";
import useUserUpdateLastActivity from "@/features/user/hooks/useUserUpdateLastActivity";
import useAppState from "@/common/hooks/useAppState";
import {startTracking, stopTracking} from "@/common/store/time-tracking";

const Globals = () => {
	const appState = useAppState();
	const updateActivityMutation = useUserUpdateLastActivity();

	const handleAppStateChange = useCallback(() => {
		switch (appState) {
			case "active": {
				startTracking();
				break;
			}
			case "background": {
				updateActivityMutation.mutate();
				stopTracking();
				break;
			}
			case "inactive": {
				updateActivityMutation.mutate();
				stopTracking();
				break;
			}
			case "unknown":
			case "extension":
				break;
		}
	}, [appState, updateActivityMutation]);

	useEffect(() => {
		handleAppStateChange();
	}, [handleAppStateChange]);

	return <Fragment />;
};

export default React.memo(Globals);