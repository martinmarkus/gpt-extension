import { ApiKey } from "./api-key.interface";

export interface AppState {
  email: string;
  authToken: string;
  apiKeys: ApiKey[];
}
