import {AxiosError} from "axios";
import _ from "lodash";
import {errors} from "@/theme";

export const formatServerErrorResponse = (error: AxiosError): string => {
    const errorMessage: string | boolean = _.get(error, 'response.data.error', false)
    if(errorMessage) return errorMessage as string
    return errors.common as string
}