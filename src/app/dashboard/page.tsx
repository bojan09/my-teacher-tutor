import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrCreateProfile } from "@/lib/appwrite/profiles";
import ContinueCard from "@/components/dashboard/ContinueCard";
import StatCard from "@/components/dashboard/StatCard";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    // Middleware should already block this, but keep the page safe standalone.
    return null;
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? "unknown";

  let profileError = false;
  let profile;
  try {
    profile = await getOrCreateProfile(userId, email);
  } catch (err) {
    console.error("Failed to load/create profile:", err);
    profileError = true;
  }

  if (profileError || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>We couldn&apos;t load your profile. Please try again shortly.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 py-24 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-slate opacity-70">
            Welcome back
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {profile.email}
          </h1>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full bg-ink text-paper px-3 py-1 text-xs font-bold">
          🔥 0 day streak
        </div>
      </div>

      <ContinueCard lessonTitle="Lesson 1: Getting Started" progressPercent={0} />

      <div className="grid grid-cols-2 gap-4 mt-6">
        <StatCard label="Vocabulary" value="0 words" />
        <StatCard label="Speaking sessions" value="0 sessions" />
      </div>
    </div>
  );
}
