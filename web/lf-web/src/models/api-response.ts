import { AppError } from "./app-error";
import { Message } from "./message";

export interface ApiResponse<T> {
  data: T | null;
  error: AppError | null;
}
