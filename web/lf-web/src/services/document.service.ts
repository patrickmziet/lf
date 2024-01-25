import { AxiosRequestConfig } from "axios";
import { ApiResponse } from "../models/api-response";
import { callExternalApi } from "./external-api.service";

const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;

export const uploadDocuments = async (accessToken: string, topicId: string, files: File[]): Promise<ApiResponse<any>> => {
    const formData = new FormData();
    formData.append('topic', topicId);
    for (let i = 0; i < files.length; i++) {
        formData.append('documents', files[i]);
    }

    const config: AxiosRequestConfig = {
        url: `${apiServerUrl}/api/documents/upload/`,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "content-Type": 'multipart/form-data'
        },
        data: formData
    };

    const { data, error } = (await callExternalApi({ config })) as ApiResponse<any>;

    return {
        data,
        error,
    };
};


export const getTopicDocuments = async (accessToken: string, topicId: string): Promise<ApiResponse<any>> => {
    const config: AxiosRequestConfig = {
        url: `${apiServerUrl}/api/documents/${topicId}`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    const { data, error } = (await callExternalApi({ config })) as ApiResponse<any>;

    return {
        data,
        error,
    };
};
