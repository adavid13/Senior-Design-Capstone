const baseUrl = process.env.API_URL + "/play";

export async function getMove() {
  return fetch(baseUrl, {
    method: "POST",
    mode: 'cors',
    body: "King to G1",
    headers: { "content-type": "text/plain" }
  })
    .then(handleResponse)
    .catch(handleError);
}

export async function handleResponse(response) {
  if (response.ok) {
    return response.text();
  }
  throw new Error("Network response was not ok.");
}

export function handleError(error) {
  // eslint-disable-next-line no-console
  console.error("API call failed. " + error);
  throw error;
}
