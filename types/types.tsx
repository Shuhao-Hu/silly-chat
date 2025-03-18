export interface Contact {
  id: number;
  username: string;
  email: string;
}

export interface FriendRequest {
  friend_request_id: number;
  sender_id: number;
  sender_username: string;
  sender_email: string;
}

export type RootStackParamList = {
  add_friend: undefined;
  friend_requests: undefined;
};

export interface AccessTokenResponse {
  access_token: string;
  refresh_token: string;
}
