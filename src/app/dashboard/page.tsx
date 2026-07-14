import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrCreateProfile } from "@/lib/appwrite/profiles";

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
    <div className="flex min-h-screen items-center justify-center">
      <p>Welcome, {profile.email}</p>
    </div>
  );
}
