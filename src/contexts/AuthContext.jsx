import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  clearAuthSession,
  createAuthSession,
  getAuthSession,
  isAccessTokenValid,
  isRefreshTokenValid,
  refreshAuthSession,
  registerUser,
  verifyUserCredentials,
} from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authSession, setAuthSession] = useState(() => getAuthSession());

  useEffect(() => {
    const storedSession = getAuthSession();
    if (!storedSession) {
      setAuthSession(null);
      return;
    }

    if (isAccessTokenValid(storedSession)) {
      setAuthSession(storedSession);
      return;
    }

    if (isRefreshTokenValid(storedSession)) {
      try {
        const refreshed = refreshAuthSession(
          storedSession,
          storedSession.refreshToken,
        );
        setAuthSession(refreshed);
        return;
      } catch {
        clearAuthSession();
        setAuthSession(null);
        return;
      }
    }

    clearAuthSession();
    setAuthSession(null);
  }, []);

  const login = useCallback(({ email, password }) => {
    const user = verifyUserCredentials({ email, password });
    const session = createAuthSession(user);
    setAuthSession(session);
    return session;
  }, []);

  const register = useCallback(({ name, email, password }) => {
    const user = registerUser({ name, email, password });
    const session = createAuthSession(user);
    setAuthSession(session);
    return session;
  }, []);

  const logout = useCallback(() => {
    clearAuthSession();
    setAuthSession(null);
  }, []);

  const refresh = useCallback(() => {
    if (!authSession || !isRefreshTokenValid(authSession)) {
      logout();
      return null;
    }

    const refreshed = refreshAuthSession(authSession, authSession.refreshToken);
    setAuthSession(refreshed);
    return refreshed;
  }, [authSession, logout]);

  const user = authSession?.user || null;
  const isAuthenticated = Boolean(user && isAccessTokenValid(authSession));

  const value = useMemo(
    () => ({
      authSession,
      user,
      isAuthenticated,
      login,
      register,
      logout,
      refresh,
    }),
    [authSession, user, isAuthenticated, login, register, logout, refresh],
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
