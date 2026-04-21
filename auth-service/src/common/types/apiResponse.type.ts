export type ApiResponse<T = unknown> = {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: T;
  timestamp: string;
};
