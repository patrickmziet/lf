import { AxiosRequestConfig } from "axios";
import { ApiResponse } from "../models/api-response";
import { callExternalApi } from "./external-api.service";
import { Message } from "../models/message";
import { Note } from "../models/note";

const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;

// Create a user if they do not exist
export const createUserIfNotExist = async (accessToken: string, userData: object): Promise<ApiResponse<any>> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/api/create-user-if-not-exist/`,
    method: "POST",
    headers: {
      "content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: userData, 
  };

  // May need someway to link the user and auth0 user
  const { data, error } = (await callExternalApi({ config })) as ApiResponse<any>;

  return {
    data,
    error,
  };
};

// Function to create a topic for the authenticated user
export const createTopic = async (accessToken: string, topicData: object): Promise<ApiResponse<any>> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/api/topics/`,
    method: "POST",
    headers: {
      "content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: topicData, 
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse<any>;

  return {
    data,
    error,
  };
};

export const deleteTopic = async (accessToken: string, id: number): Promise<ApiResponse<any>> => {
  const config: AxiosRequestConfig = {
      url: `${apiServerUrl}/api/topics/delete/${id}/`,
      method: "DELETE",
      headers: {
          "content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
      },
  };

  const response = (await callExternalApi({ config })) as ApiResponse<any>;

  return {
      data: response.data,
      error: response.error,
      status: response.status,
  };
};

// Function to get topics for the authenticated user
export const getUserTopics = async (accessToken: string): Promise<ApiResponse<{ topics: any }>> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/api/topics/`,
    method: "GET",
    headers: {
      "content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    }, 
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse<{ topics: any }>;

  return {
    data,
    error,
  };
};


// Function to get notes for the authenticated user
export const getUserNotes = async (accessToken: string): Promise<ApiResponse<{ notes: Note[] }>> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/api/notes/`,
    method: "GET",
    headers: {
      "content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    }, 
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse<{ notes: Note[] }>;

  return {
    data,
    error,
  };
};

// Function to create a new note for the authenticated user
export const createNote = async (accessToken: string, noteData: object): Promise<ApiResponse<Note>> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/api/notes/`,
    method: "POST",
    headers: {
      "content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    data: noteData, // This should include the title and content of the note
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse<Note>;

  return {
    data,
    error,
  };
};


export const getPublicResource = async (): Promise<ApiResponse<Message>> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/api/public`,
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse<Message>;

  return {
    data,
    error,
  };
};

export const getProtectedResource = async (
  accessToken: string
): Promise<ApiResponse<Message>> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/api/protected`,
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse<Message>;

  return {
    data,
    error,
  };
};

export const getAdminResource = async (
  accessToken: string
): Promise<ApiResponse<Message>> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/api/admin`,
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse<Message>;

  return {
    data,
    error,
  };
};
