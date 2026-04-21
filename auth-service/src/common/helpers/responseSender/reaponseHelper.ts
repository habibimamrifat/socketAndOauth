import { ApiResponse } from '../../types/apiResponse.type';

export const sendResponse = <T>({
  success = true,
  statusCode = 200,
  message,
  data,
}: {
  success?: boolean;
  message?: string;
  statusCode?: number;
  data?: T;
}): ApiResponse<T> => {
  return {
    success,
    statusCode,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
};
