import { AxiosRequestConfig } from "axios";
import { ApiResponse } from "../models/api-response";
import { Flashcard } from "../models/flashcard";
import { Topic } from "../models/topic";
import { callExternalApi } from "./external-api.service";

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

export const deleteTopic = async (accessToken: string, topicId: string): Promise<ApiResponse<any>> => {
  const config: AxiosRequestConfig = {
      url: `${apiServerUrl}/api/topics/delete/${topicId}/`,
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

// Function to get a topic for the authenticated user given the topic id
export const getTopic = async (accessToken: string, topicId: string): Promise<ApiResponse<Topic>> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/api/topics/${topicId}/`,
    method: "GET",
    headers: {
      "content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    }, 
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse<Topic>;

  return {
    data,
    error,
  };
}


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

// Function to get flash cards for a specific topic for the authenticated user
export const getTopicFlashCards = async (accessToken: string, topicId: string): Promise<ApiResponse<{ flashCards: any }>> => {
  const config: AxiosRequestConfig = {
    url: `${apiServerUrl}/api/flashcards/${topicId}/`,
    method: "GET",
    headers: {
      "content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    }, 
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse<{ flashCards: any }>;

  return {
    data,
    error,
  };
};

// Function to update flashcards for the authenticated user
export const updateFlashCards = async (accessToken: string, flashcards: Flashcard[]): Promise<ApiResponse<any>> => {
  const config: AxiosRequestConfig = {
      url: `${apiServerUrl}/api/flashcards/update/`,
      method: "POST",
      headers: {
          "content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
      },
      data: flashcards,
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse<any>;

  return {
      data,
      error,
  };
};


// Function to create more flashcards for the authenticated user
export const createMoreFlashCards = async (accessToken: string, topicId: string, flashcards: Flashcard[]): Promise<ApiResponse<Flashcard[]>> => {
  const config: AxiosRequestConfig = {
      url: `${apiServerUrl}/api/flashcards/more/${topicId}/`,
      method: "GET",
      headers: {
          "content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
      },
      data: flashcards,
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse<Flashcard[]>;

  return {
      data,
      error,
  };
};


// Function to delete a flashcard for the authenticated user
export const deleteFlashCard = async (accessToken: string, cardId: number): Promise<ApiResponse<any>> => {
  const config: AxiosRequestConfig = {
      url: `${apiServerUrl}/api/flashcards/delete/${cardId}/`,
      method: "DELETE",
      headers: {
          "content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
      },
  };

  const { data, error } = (await callExternalApi({ config })) as ApiResponse<any>;

  return {
      data,
      error,
  };
};