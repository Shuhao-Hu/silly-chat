export interface Contact {
  id: number;
  username: string;
}

export interface FriendRequest {
  friend_request_id: number;
  sender_id: number;
  sender_username: string;
}

export type RootStackParamList = {
  add_friend: undefined;
};