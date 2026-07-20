import axios, { type AxiosInstance } from "axios";

import { SESSION_STORAGE_KEY } from "@/constants/session";
import { secureStorage } from "@/services/secure-storage";

/** Set EXPO_PUBLIC_API_URL to your project REST base URL (no trailing slash required). */
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.trim() ?? "";

let client: AxiosInstance | null = null;

/**
 * Singleton axios instance with Bearer auth from secureStorage (`SESSION_STORAGE_KEY`).
 * Reads the token independently of React SessionProvider — same pattern as the Apollo auth link.
 */
export function getRestClient(): AxiosInstance {
  if (client) {
    return client;
  }

  if (!API_BASE_URL) {
    throw new Error("EXPO_PUBLIC_API_URL is not set — configure your project REST base URL.");
  }

  client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15_000,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  client.interceptors.request.use(async (config) => {
    const token = await secureStorage.getItem(SESSION_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const message =
        axios.isAxiosError(error) && error.response
          ? `${error.response.status} ${error.message}`
          : error instanceof Error
            ? error.message
            : "Unknown network error";
      console.log(`REST error: ${message}`);
      return Promise.reject(error);
    },
  );

  return client;
}

/** Dev placeholder shape — JSONPlaceholder `GET /todos/:id`. Replace with your API types. */
export type ExampleTodo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export async function fetchExampleTodo(id = 1): Promise<ExampleTodo> {
  const { data } = await getRestClient().get<ExampleTodo>(`/todos/${id}`);
  return data;
}
