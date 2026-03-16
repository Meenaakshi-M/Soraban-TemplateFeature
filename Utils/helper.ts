export async function logresponse(response) {
    const responseBody = await response.json();
    console.log('Response Body:', responseBody);
  }

export function StatusCodeTobBeOneOf(response, expectedStatusCodes) {
    const receivedStatusCode = response.status();
    if (!expectedStatusCodes.includes(receivedStatusCode)) {
      throw new Error(`Expected status code to be one of ${expectedStatusCodes.join(', ')}, but received ${receivedStatusCode}`);
    }
}
