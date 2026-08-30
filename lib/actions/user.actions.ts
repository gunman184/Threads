"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

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
