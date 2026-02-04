/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

function loadEnvFromDotenv(dotenvPath) {
  try {
    const txt = fs.readFileSync(dotenvPath, "utf8");
    const lines = txt.split(/\r?\n/);
    const env = {};
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      // remove optional surrounding quotes
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
    return env;
  } catch {
    return {};
  }
}

async function main() {
  let uri = process.env.MONGODB_URI;
  if (!uri) {
    // try to read .env.local in project root
    const dotenvPath = path.resolve(__dirname, "..", ".env.local");
    const env = loadEnvFromDotenv(dotenvPath);
    uri = env.MONGODB_URI || env.MONGO_URI || env.MONGODB_URL;
  }

  if (!uri) {
    console.error(
      "MONGODB_URI not found. Set the environment variable or add it to .env.local",
    );
    process.exit(1);
  }

  await mongoose.connect(uri, {});
  console.log("Connected to MongoDB");

  const db = mongoose.connection.db;
  const rooms = db.collection("rooms");

  // Remove location field when coordinates missing
  const filter = {
    $and: [
      { location: { $exists: true } },
      {
        $or: [
          { "location.coordinates": { $exists: false } },
          { "location.coordinates": null },
          { "location.coordinates": { $size: 0 } },
        ],
      },
    ],
  };

  const res = await rooms.updateMany(filter, { $unset: { location: "" } });
  console.log(
    "Documents matched:",
    res.matchedCount,
    "modified:",
    res.modifiedCount,
  );

  // Optionally, log one example of a problematic document
  const example = await rooms.findOne({
    "location.type": "Point",
    "location.coordinates": { $exists: false },
  });
  if (example) {
    console.log("Example remaining problematic doc (if any):", example);
  }

  await mongoose.disconnect();
  console.log("Done");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
