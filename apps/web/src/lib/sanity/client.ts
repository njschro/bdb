import { createClient, type SanityClient } from "@sanity/client";

// Lazy-loaded clients to avoid initialization when USE_SANITY = false
let _client: SanityClient | null = null;
let _previewClient: SanityClient | null = null;

function getConfig() {
  const projectId = import.meta.env.SANITY_PROJECT_ID;
  if (!projectId) {
    throw new Error(
      "SANITY_PROJECT_ID is not set. Please add it to apps/web/.env"
    );
  }
  return {
    projectId,
    dataset: import.meta.env.SANITY_DATASET || "production",
    apiVersion: import.meta.env.SANITY_API_VERSION || "2024-01-01",
    token: import.meta.env.SANITY_READ_TOKEN,
  };
}

export function getClient(): SanityClient {
  if (!_client) {
    const config = getConfig();
    _client = createClient({
      ...config,
      useCdn: import.meta.env.PROD,
    });
  }
  return _client;
}

// Client without CDN for real-time/preview
export function getPreviewClient(): SanityClient {
  if (!_previewClient) {
    const config = getConfig();
    _previewClient = createClient({
      ...config,
      useCdn: false,
    });
  }
  return _previewClient;
}

// Legacy exports for backward compatibility (deprecated)
export const client = {
  fetch: (...args: Parameters<SanityClient["fetch"]>) =>
    getClient().fetch(...args),
};

export const previewClient = {
  fetch: (...args: Parameters<SanityClient["fetch"]>) =>
    getPreviewClient().fetch(...args),
};
