import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads in development.
 * This prevents exhausting MongoDB connections when Next.js hot-reloads modules.
 */
type Cached = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var _mongooseCache: Cached | undefined;
}

const cached: Cached = global._mongooseCache ?? { conn: null, promise: null };

if (!cached.promise) {
  const opts = {
    // Recommended Mongoose options
    bufferCommands: false,
    // Add other options if needed
  } as mongoose.ConnectOptions;

  cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m);
  global._mongooseCache = cached;
}

export async function connect() {
  if (cached.conn) return cached.conn;
  cached.conn = await cached.promise!;
  return cached.conn;
}

export default connect;
