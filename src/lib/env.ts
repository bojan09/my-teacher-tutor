function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  clerkPublishableKey: () => requireEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"),
  clerkSecretKey: () => requireEnv("CLERK_SECRET_KEY"),
  appwriteEndpoint: () => requireEnv("NEXT_PUBLIC_APPWRITE_ENDPOINT"),
  appwriteProjectId: () => requireEnv("APPWRITE_PROJECT_ID"),
  appwriteApiKey: () => requireEnv("APPWRITE_API_KEY"),
  appwriteDatabaseId: () => requireEnv("APPWRITE_DATABASE_ID"),
  appwriteProfilesCollectionId: () =>
    requireEnv("APPWRITE_PROFILES_COLLECTION_ID"),
};
