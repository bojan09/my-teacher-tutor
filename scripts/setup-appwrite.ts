// scripts/setup-appwrite.ts
import { Client, Databases, DatabasesIndexType, Permission, Role } from "node-appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.APPWRITE_DATABASE_ID ?? "english-tutor";
const collectionId = process.env.APPWRITE_PROFILES_COLLECTION_ID ?? "profiles";

if (!endpoint || !projectId || !apiKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, or APPWRITE_API_KEY in environment",
  );
}

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const databases = new Databases(client);

async function ensureDatabase() {
  try {
    await databases.get(databaseId);
    console.log(`Database "${databaseId}" already exists.`);
  } catch {
    await databases.create(databaseId, "English Tutor");
    console.log(`Created database "${databaseId}".`);
  }
}

async function ensureProfilesCollection() {
  try {
    await databases.getCollection(databaseId, collectionId);
    console.log(`Collection "${collectionId}" already exists.`);
    return;
  } catch {
    // fall through to create
  }

  await databases.createCollection(
    databaseId,
    collectionId,
    "Profiles",
    [Permission.read(Role.any()), Permission.write(Role.any())],
  );
  await databases.createStringAttribute(databaseId, collectionId, "clerkUserId", 255, true);
  await databases.createStringAttribute(databaseId, collectionId, "email", 320, true);
  await databases.createDatetimeAttribute(databaseId, collectionId, "createdAt", true);
  console.log(`Created collection "${collectionId}" with attributes.`);

  // Attributes must finish provisioning before an index can reference them;
  // Appwrite attribute creation is async server-side.
  await new Promise((resolve) => setTimeout(resolve, 3000));

  await databases.createIndex(
    databaseId,
    collectionId,
    "clerkUserId_unique",
    DatabasesIndexType.Unique,
    ["clerkUserId"],
  );
  console.log("Created unique index on clerkUserId.");
}

async function main() {
  await ensureDatabase();
  await ensureProfilesCollection();
  console.log("Appwrite setup complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
