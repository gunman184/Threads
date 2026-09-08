import { loadEnvConfig } from "@next/env";
import { connectToDB } from "@/lib/mongoose";
import Thread from "@/lib/models/thread.model";

async function migrate() {
  loadEnvConfig(process.cwd());
  console.log("Mongo URL exists:", !!process.env.MONGODB_URL);
  await connectToDB();

  const result = await Thread.updateMany(
    { likesCount: { $exists: false } },
    { $set: { likesCount: 0 } },
  );

  console.log(`Updated ${result.modifiedCount} threads`);

  process.exit(0);
}

migrate();
