export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function throwApiError(response: Response, fallbackMessage: string): Promise<never> {
  const data = await response.json().catch(() => null);
  const message = typeof data?.message === "string" ? data.message : fallbackMessage;
  throw new ApiError(message, response.status);
}
