/**
 * Storage utility using expo-file-system.
 *
 * This provides a simple key-value storage interface using the file system,
 * which is built into Expo Go and works reliably without native modules.
 *
 * Uses the new expo-file-system API (SDK 56+) with File and Directory classes.
 */

import { File, Directory, Paths } from "expo-file-system";

// Storage directory in app's document directory
const STORAGE_DIR_NAME = "habit-tracker-storage";

// Get or create storage directory
function getStorageDirectory(): Directory {
  return new Directory(Paths.document, STORAGE_DIR_NAME);
}

// Get file for a key
function getFile(key: string): File {
  // Sanitize key for use as filename
  const safeKey = key.replace(/[^a-zA-Z0-9-_]/g, "_") + ".json";
  const dir = getStorageDirectory();
  return new File(dir, safeKey);
}

/**
 * Get a value from storage by key.
 * Returns null if the key doesn't exist.
 */
export async function getItem(key: string): Promise<string | null> {
  try {
    const dir = getStorageDirectory();
    if (!dir.exists) {
      return null;
    }

    const file = getFile(key);
    if (!file.exists) {
      return null;
    }

    return await file.text();
  } catch (error) {
    console.error("Storage getItem error:", error);
    return null;
  }
}

/**
 * Set a value in storage.
 * Creates or updates the key-value pair.
 */
export async function setItem(key: string, value: string): Promise<void> {
  try {
    const dir = getStorageDirectory();
    if (!dir.exists) {
      dir.create();
    }

    const file = getFile(key);
    await file.write(value);
  } catch (error) {
    console.error("Storage setItem error:", error);
  }
}

/**
 * Remove a value from storage.
 */
export async function removeItem(key: string): Promise<void> {
  try {
    const file = getFile(key);
    if (file.exists) {
      await file.delete();
    }
  } catch (error) {
    console.error("Storage removeItem error:", error);
  }
}
