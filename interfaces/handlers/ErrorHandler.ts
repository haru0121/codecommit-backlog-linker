export const errorHandler = (error: any) => {
  return {
    statusCode: error?.response?.status || 500,
    body: JSON.stringify({
      message: error.message,
      data: error?.response?.data ?? null,
    })
  };
};