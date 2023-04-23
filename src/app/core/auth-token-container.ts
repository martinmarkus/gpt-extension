let authToken: string = '';

export function setAuthToken(token: string) {
  console.log('SET AuthToken: ' + token);
  authToken = token;
}

export function getAuthToken(): string {
  console.log('GET AuthToken: ' + authToken);
  return authToken;
}
