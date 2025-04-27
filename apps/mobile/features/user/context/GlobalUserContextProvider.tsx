import React, {createContext, useEffect} from "react";
import {WithChildren} from "@/common/types/common";
import SingleUser from "@/features/user/classes/SingleUser";
import {useAuthStoreSelectors} from "@/features/auth/store/auth";
import {useQueryClient} from "@tanstack/react-query";
import useUserCurrent from "@/features/user/hooks/useUserCurrent";
import useEventListener from "@/common/hooks/useEventListener";

export const GlobalUserContext = createContext<SingleUser | null>(null)

const GlobalUserContextProvider = ({children}: WithChildren) => {

	const queryClient = useQueryClient()
	const authorized = useAuthStoreSelectors.authorized()

	const currentUserQuery = useUserCurrent()

	useEffect(() => {
		queryClient.invalidateQueries({ queryKey: ['users', 'current'], refetchType: 'all' })
	}, [authorized]);

	useEventListener('user:invalidate', async () => {
		queryClient.removeQueries({ queryKey: ['users', 'current'] })

		await currentUserQuery.refetch()
	})

	return(
        <GlobalUserContext.Provider value={currentUserQuery.data as SingleUser | null}>
	        {children}
        </GlobalUserContext.Provider>
    )
}

export default GlobalUserContextProvider