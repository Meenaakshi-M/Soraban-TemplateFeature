import {APIRequestContext} from '@playwright/test';

export class ApiClient {
  constructor(public request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Sends a GET request to the specified endpoint.
   * @param endpoint The API endpoint to send the GET request to.
   * @returns The response from the API.
   */
  async get(endpoint: string) {
    const response = await this.request.get(endpoint);
    return response;
  }

  /**
   * Sends a POST request to the specified endpoint with a JSON Payload.
   * @param endpoint The API endpoint to send the POST request to.
   * @param data The data to be sent in the POST request body.
   * @returns The response from the API.
   */
  async post(endpoint: string, data: any) {
    const response = await this.request.post(endpoint, {
      data: data,
    });
    return response;
  }

  /**
   * Sends a PUT request to the specified endpoint with a JSON Payload.
   * @param endpoint The API endpoint to send the PUT request to.
   * @param data The data to be sent in the PUT request body.
   * @returns The response from the API.
   */
  async put(endpoint: string, data: any) {
    const response = await this.request.put(endpoint, {
      data: data,
    });
    return response;
  }

  /**
   * Sends a DELETE request to the specified endpoint.
   * @param endpoint The API endpoint to send the DELETE request to.
   * @returns The response from the API.
   */
  async delete(endpoint: string) {
    const response = await this.request.delete(endpoint);
    return response;
  }
}
