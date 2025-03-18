import { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";
import { useConfig } from "./ConfigContext";
import { Contact, FriendRequest, AccessTokenResponse } from "@/types/types";

interface LoginCredential {
  email: string;
  password: string;
}

interface SignupCredential {
  email: string;
  password: string;
  username: string;
}

interface LoginSuccess {
  id: number;
  username: string;
  access_token: string;
  refresh_token: string;
}

interface AuthFailure {
  error: string;
}

type LoginResponse = LoginSuccess | AuthFailure;

interface SignupSuccess {
  user_id: number;
  message: string;
}

type SignupResponse = SignupSuccess | AuthFailure;

interface ContactResponse {
  friends: Contact[];
}


interface FriendRequestResponse {
  friend_requests: FriendRequest[];
}

interface ApiContextType {
  userLogin: (cred: LoginCredential) => Promise<LoginResponse>;
  fetchContacts: () => Promise<Contact[]>;
  respondFriendRequest: (request_id: number, senderID: number, response: string) => Promise<void>;
  fetchFriendRequests: () => Promise<FriendRequest[]>;
  userSignup: (cred: SignupCredential) => Promise<SignupResponse>;
  searchContactByEmail: (email: string) => Promise<Contact | null>;
  sendFriendRequest: (friend_id: number) => Promise<boolean>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const config = useConfig();
  const { logout, getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } = useAuth();

  const refreshAccessToken = async (): Promise<AccessTokenResponse | null> => {
    try {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) throw new Error("No refresh token found");

      const response = await fetch(config.API_URL + "/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to refresh access token");
      }
      const data: AccessTokenResponse = await response.json();
      return data;
    } catch (error) {
      logout();
      return null;
    }
  }

  const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const accessToken = await getAccessToken();
    if (!accessToken) throw new Error("No access token found");
    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `${accessToken}`,
      },
    });
    if (response.status === 401) {
      console.log("Access token expired, refreshing...");
      const tokens = await refreshAccessToken();
      if (!tokens) {
        logout();
        return response;
      }
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `${tokens.access_token}`,
        },
      });
      setAccessToken(tokens.access_token);
      setRefreshToken(tokens.refresh_token);
    }
    return response;
  };

  const fetchContacts = async () => {
    const response = await fetchWithAuth(config.API_URL + "/protected/friends", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${getAccessToken()}`,
      },
    });
    if (!response.ok) {
      return [];
    }
    const data: ContactResponse = await response.json();
    return data.friends;
  };

  const fetchFriendRequests = async () => {
    const response = await fetchWithAuth(config.API_URL + "/protected/friends/requests", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${getAccessToken()}`,
      },
    });
    if (!response.ok) {
      return [];
    }
    const data: FriendRequestResponse = await response.json();
    return data.friend_requests;
  };

  const searchContactByEmail = async (email: string) => {
    const params = new URLSearchParams({ email: email });
    const response = await fetchWithAuth(`${config.API_URL}/protected/friends/search?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${getAccessToken()}`,
      }
    });
    if (!response.ok) {
      return null;
    }
    const data: Contact = await response.json();
    return data;
  }

  const sendFriendRequest = async (friend_id: number) => {
    const response = await fetchWithAuth(`${config.API_URL}/protected/friends/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${getAccessToken()}`,
      },
      body: JSON.stringify({
        friend_id: friend_id
      }),
    });

    return response.ok;
  }

  const userLogin = async (cred: LoginCredential) => {
    const response = await fetch(config.API_URL + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: cred.email,
        password: cred.password,
      }),
    });
    const data: LoginResponse = await response.json();
    if (!response.ok) {
      return data as AuthFailure;
    }
    return data as LoginSuccess;
  };

  const userSignup = async (cred: SignupCredential) => {
    const response = await fetch(config.API_URL + "/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: cred.email,
        password: cred.password,
        username: cred.username,
      }),
    });
    const data: SignupResponse = await response.json();
    if (!response.ok) {
      return data as AuthFailure;
    }
    return data as SignupSuccess;
  };

  const respondFriendRequest = async (friendRequestID: number, senderID: number, friendRequestResponse: string) => {
    const response = await fetchWithAuth(config.API_URL + `/protected/friends/requests/${friendRequestID}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender_id: senderID,
        response: friendRequestResponse,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to respond to friend request");
    }
  }

  return (
    <ApiContext.Provider value={{
      userLogin,
      userSignup,
      fetchContacts,
      fetchFriendRequests,
      respondFriendRequest,
      searchContactByEmail,
      sendFriendRequest,
    }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = (): ApiContextType => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
