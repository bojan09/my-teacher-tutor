import { ID, Query } from "node-appwrite";
import { getDatabases } from "@/lib/appwrite/client";
import { env } from "@/lib/env";

export interface Profile {
  $id: string;
  clerkUserId: string;
  email: string;
  createdAt: string;
}

export async function getOrCreateProfile(
  clerkUserId: string,
  email: string,
): Promise<Profile> {
  const databases = getDatabases();
  const databaseId = env.appwriteDatabaseId();
  const collectionId = env.appwriteProfilesCollectionId();

  const existing = await databases.listDocuments(databaseId, collectionId, [
    Query.equal("clerkUserId", clerkUserId),
  ]);

  if (existing.documents.length > 0) {
    return existing.documents[0] as unknown as Profile;
  }

  const created = await databases.createDocument(
    databaseId,
    collectionId,
    ID.unique(),
    {
      clerkUserId,
      email,
      createdAt: new Date().toISOString(),
    },
  );

  return created as unknown as Profile;
}
