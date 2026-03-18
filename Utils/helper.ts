import { APIResponse } from "@playwright/test";

export async function logresponse(response: APIResponse) {
   console.log('Status:', response.status());  
   const responseBody = await response.json();
    console.log('Response Body:', responseBody);
  }

export function StatusCodeToBeOneOf(response: APIResponse, expectedStatusCodes: number[]) {
    const receivedStatusCode = response.status();
    if (!expectedStatusCodes.includes(receivedStatusCode)) {
      throw new Error(`Expected status code to be one of ${expectedStatusCodes.join(', ')}, but received ${receivedStatusCode}`);
    }
}
