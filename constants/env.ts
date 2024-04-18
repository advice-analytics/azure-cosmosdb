export const isProd = process.env.NODE_ENV === 'production'
export const isLocal = process.env.NODE_ENV === 'development'

// constants/env.ts
export const cosmosdbConnect = process.env.NEXT_PUBLIC_COSMOSDB_CONNECTION_STRING!;
export const cosmosDatabase = process.env.NEXT_PUBLIC_COSMOSDB_DATABASE_NAME!;
export const cosmosContainer = process.env.NEXT_PUBLIC_COSMOSDB_CONTAINER_NAME!;
export const showLogger = process.env.NEXT_PUBLIC_SHOW_LOGGER === 'true' || false;

