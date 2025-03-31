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

export type WsMessageType = "dm" | "friend_request";

export interface WebSocketMessage<T = unknown> {
  type: WsMessageType;
  payload: T;
}

export interface DirectMessagePayload {
  sender_id: number,
  recipient_id: number,
  content: string,
  timestamp: string,
}

export interface ActiveConversation {
  user_id: number,
  chatting_user_id: number,
  last_updated: Date,
}

export interface LoginCredential {
  email: string;
  password: string;
}

export interface SignupCredential {
  email: string;
  password: string;
  username: string;
}

export interface LoginSuccess {
  id: number;
  username: string;
  access_token: string;
  refresh_token: string;
}

export interface AuthFailure {
  error: string;
}

export type LoginResponse = LoginSuccess | AuthFailure;

export interface SignupSuccess {};

export type SignupResponse = SignupSuccess | AuthFailure;

export interface ContactResponse {
  friends: Contact[];
}


export interface FriendRequestResponse {
  friend_requests: FriendRequest[];
}

