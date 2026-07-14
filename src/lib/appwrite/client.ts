import "server-only";
import { Client, Databases } from "node-appwrite";
import { env } from "@/lib/env";

export function getAppwriteClient(): Client {
  return new Client()
    .setEndpoint(env.appwriteEndpoint())
    .setProject(env.appwriteProjectId())
    .setKey(env.appwriteApiKey());
}

export function getDatabases(): Databases {
  return new Databases(getAppwriteClient());
}
