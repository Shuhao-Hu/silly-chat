import { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";
import { useConfig } from "./ConfigContext";
import { Contact, FriendRequest } from "@/types/types";

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
  respondFriendRequest: (request_id: number, response: string) => Promise<void>;
  fetchFriendRequests: () => Promise<FriendRequest[]>;
  userSignup: (cred: SignupCredential) => Promise<SignupResponse>;
}

interface AccessTokenResponse {
  access_token: string;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const config = useConfig();
  const { logout, getAccessToken, getRefreshToken, setAccessToken } = useAuth();

  const refreshAccessToken = async (): Promise<string | null> => {
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
      return data.access_token;
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
      const newToken = await refreshAccessToken();
      if (!newToken) {
        logout();
        return response;
      }
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `${newToken}`,
        },
      });
      setAccessToken(newToken);
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

  const respondFriendRequest = async (friendRequestID: number, friendRequestResponse: string) => {
    const response = await fetchWithAuth(config.API_URL + `/protected/friends/requests/${friendRequestID}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender_id: friendRequestID,
        response: friendRequestResponse,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to respond to friend request");
    }
  }

  return (
    <ApiContext.Provider value={{ userLogin, userSignup, fetchContacts, fetchFriendRequests, respondFriendRequest }}>
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
