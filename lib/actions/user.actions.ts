"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function fetchUser(userId: string) {
  try {
    await connectToDB();
    return await User.findOne({ id: userId });
    // .populate({
    //   path: 'communities',
    //   model: Community
    // })
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> {
  try {
    await connectToDB(); // ✅ FIX 1

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      {
        upsert: true,
        new: true, // ✅ FIX 2w
      },
    );

    // ✅ FIX 3: refresh all relevant pages
    revalidatePath(path);
    revalidatePath("/");
    revalidatePath("/profile");
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function getUserById(userId: string) {
  try {
    await connectToDB();

    const user = await User.findOne({ id: userId });

    if (!user) return null;

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    await connectToDB();

    // TODO: Populate community
    const threads = await User.findOne({ id: userId })
      .populate({
        path: "threads",
        model: Thread,
        populate: {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name, image id",
          },
        },
      })
      .lean();
    //return threads;
    return JSON.parse(JSON.stringify(threads));
  } catch (error: any) {
    throw new Error(`Failed to fetch user posts: ${error.message}`);
  }
}
export async function threadsCount(userId: string) {
  try {
    await connectToDB();

    const user = await User.findOne({ id: userId });

    const count = user?.threads?.length ?? 0;
    return count;
  } catch (error: any) {
    throw new Error(`Failed to fetch user posts count: ${error.message}`);
  }
}
