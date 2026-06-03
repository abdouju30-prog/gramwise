import {
  applyLocalSnapshot,
  buildLocalSnapshot,
  mergeSnapshots,
  parseCloudSnapshot,
  type CloudSnapshotV1,
} from "@/lib/cloud-sync";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const TABLE = "user_snapshots";

export async function pullRemoteSnapshot(
  userId: string,
): Promise<CloudSnapshotV1 | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("payload, updated_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data?.payload) return null;

  const snapshot = parseCloudSnapshot(data.payload);
  if (!snapshot) return null;
  if (typeof data.updated_at === "string") {
    snapshot.updatedAt = data.updated_at;
  }
  return snapshot;
}

export async function pushRemoteSnapshot(
  userId: string,
  snapshot: CloudSnapshotV1,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from(TABLE).upsert({
    user_id: userId,
    payload: snapshot,
    updated_at: snapshot.updatedAt,
  });
  if (error) throw error;
}

export async function syncCloudForUser(userId: string): Promise<"pushed" | "merged"> {
  const local = buildLocalSnapshot();
  const remote = await pullRemoteSnapshot(userId);

  if (!remote) {
    await pushRemoteSnapshot(userId, local);
    return "pushed";
  }

  const merged = mergeSnapshots(local, remote);
  applyLocalSnapshot(merged);
  await pushRemoteSnapshot(userId, merged);
  return "merged";
}

let pushTimer: ReturnType<typeof setTimeout> | null = null;

export function scheduleCloudPush(userId: string | null): void {
  if (!userId || !isSupabaseConfigured()) return;
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushTimer = null;
    void (async () => {
      try {
        const snapshot = buildLocalSnapshot();
        await pushRemoteSnapshot(userId, snapshot);
      } catch {
        /* network / auth — retry on next edit */
      }
    })();
  }, 2000);
}

export async function signInWithEmail(email: string): Promise<string | null> {
  const supabase = createClient();
  const redirectTo =
    typeof window !== "undefined"
      ? `${window.location.origin}/account`
      : undefined;
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });
  return error?.message ?? null;
}

export async function signOutCloud(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}
