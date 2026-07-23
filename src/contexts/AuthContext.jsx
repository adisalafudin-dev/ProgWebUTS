import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  clearAuthSession,
  getAuthSession,
  isAccessTokenValid,
  isRefreshTokenValid,
  saveAuthSession,
} from "../services/authService.js";
import authApi from "../services/authApi.js";

const AUTH_SESSION_KEY = "aksarahub-auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authSession, setAuthSession] = useState(() => getAuthSession());
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      const storedSession = getAuthSession();

      if (!storedSession) {
        setAuthSession(null);
        setInitializing(false);
        return;
      }

      if (isAccessTokenValid(storedSession)) {
        try {
          const profile = await authApi.getProfile();
          const updatedSession = {
            ...storedSession,
            user: profile.data || profile,
          };
          saveAuthSession(updatedSession);
          setAuthSession(updatedSession);
        } catch {
          // Token valid but server error — keep existing session
          setAuthSession(storedSession);
        }
        setInitializing(false);
        return;
      }

      if (isRefreshTokenValid(storedSession)) {
        try {
          const refreshed = await authApi.refreshToken({
            refreshToken: storedSession.refreshToken,
          });
          const newSession = {
            ...storedSession,
            accessToken: refreshed.accessToken || refreshed.data?.accessToken,
            expiresAt: Date.now() + 5 * 60 * 1000,
          };
          saveAuthSession(newSession);
          setAuthSession(newSession);
        } catch {
          clearAuthSession();
          setAuthSession(null);
        }
        setInitializing(false);
        return;
      }

      clearAuthSession();
      setAuthSession(null);
      setInitializing(false);
    };

    initSession();
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const response = await authApi.login({ email, password });
    const data = response.data || response;

    const session = {
      user: data.user || { email, name: email.split("@")[0] },
      tokenType: data.tokenType || "Bearer",
      accessToken: data.accessToken || data.token,
      refreshToken: data.refreshToken,
      issuedAt: Date.now(),
      expiresAt: Date.now() + 5 * 60 * 1000,
      refreshExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    };

    saveAuthSession(session);
    setAuthSession(session);
    return session;
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    const response = await authApi.register({ name, email, password });
    const data = response.data || response;

    const session = {
      user: data.user || { name, email },
      tokenType: data.tokenType || "Bearer",
      accessToken: data.accessToken || data.token,
      refreshToken: data.refreshToken,
      issuedAt: Date.now(),
      expiresAt: Date.now() + 5 * 60 * 1000,
      refreshExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    };

    saveAuthSession(session);
    setAuthSession(session);
    return session;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Logout tetap dijalankan meskipun server error
    }
    clearAuthSession();
    setAuthSession(null);
  }, []);

  const refresh = useCallback(async () => {
    const currentSession = getAuthSession();
    if (!currentSession || !isRefreshTokenValid(currentSession)) {
      logout();
      return null;
    }

    try {
      const refreshed = await authApi.refreshToken({
        refreshToken: currentSession.refreshToken,
      });
      const data = refreshed.data || refreshed;
      const updatedSession = {
        ...currentSession,
        accessToken: data.accessToken || data.token,
        expiresAt: Date.now() + 5 * 60 * 1000,
      };
      saveAuthSession(updatedSession);
      setAuthSession(updatedSession);
      return updatedSession;
    } catch {
      logout();
      return null;
    }
  }, [logout]);

  const user = authSession?.user || null;
  const isAuthenticated = Boolean(user && isAccessTokenValid(authSession));

  const value = useMemo(
    () => ({
      authSession,
      user,
      isAuthenticated,
      initializing,
      login,
      register,
      logout,
      refresh,
    }),
    [
      authSession,
      user,
      isAuthenticated,
      initializing,
      login,
      register,
      logout,
      refresh,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
