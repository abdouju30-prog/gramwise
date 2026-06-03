"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DATA_CHANGED_EVENT } from "@/lib/data-events";
import {
  scheduleCloudPush,
  syncCloudForUser,
  signOutCloud,
} from "@/lib/cloud-sync-remote";
import { setAuthenticatedUserId } from "@/lib/recipe-owner";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type AuthContextValue = {
  configured: boolean;
  userId: string | null;
  email: string | null;
  syncing: boolean;
  lastSync: string | null;
  syncNow: () => Promise<boolean>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseConfigured();
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const runSync = useCallback(async (uid: string) => {
    setSyncing(true);
    try {
      await syncCloudForUser(uid);
      setLastSync(new Date().toISOString());
      return true;
    } catch {
      return false;
    } finally {
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    if (!configured) return;

    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      if (!user) return;
      setUserId(user.id);
      setEmail(user.email ?? null);
      setAuthenticatedUserId(user.id);
      void runSync(user.id);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user;
        if (user) {
          setUserId(user.id);
          setEmail(user.email ?? null);
          setAuthenticatedUserId(user.id);
          if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
            await runSync(user.id);
          }
        } else {
          setUserId(null);
          setEmail(null);
          setAuthenticatedUserId(null);
        }
      },
    );

    return () => sub.subscription.unsubscribe();
  }, [configured, runSync]);

  useEffect(() => {
    if (!userId) return;
    const handler = () => scheduleCloudPush(userId);
    window.addEventListener(DATA_CHANGED_EVENT, handler);
    return () => window.removeEventListener(DATA_CHANGED_EVENT, handler);
  }, [userId]);

  const signOut = useCallback(async () => {
    if (configured) await signOutCloud();
    setAuthenticatedUserId(null);
    setUserId(null);
    setEmail(null);
    setLastSync(null);
  }, [configured]);

  const value = useMemo(
    () => ({
      configured,
      userId,
      email,
      syncing,
      lastSync,
      syncNow: async () => (userId ? runSync(userId) : false),
      signOut,
    }),
    [configured, userId, email, syncing, lastSync, runSync, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      configured: false,
      userId: null,
      email: null,
      syncing: false,
      lastSync: null,
      syncNow: async () => false,
      signOut: async () => {},
    };
  }
  return ctx;
}
