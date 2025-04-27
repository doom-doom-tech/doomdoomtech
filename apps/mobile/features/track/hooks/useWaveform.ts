import {useQuery} from "@tanstack/react-query";
import axios from "axios";

const fetchWaveform = async (source: string) => {
	const response = await axios.get(source)
	return response.data
}

const useWaveform = (source: string) => useQuery({
	queryKey: ['waveform', source],
	queryFn: () => fetchWaveform(source)
})

export default useWaveform