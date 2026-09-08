"use server";

import { connectToDB } from "../mongoose";
import Like from "../models/likes.model";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
interface Params {
  user: string;
  thread: string;
  path: string;
}

export async function toggleLike({ user, thread, path }: Params) {
  await connectToDB();

  const existingLike = await Like.findOne({
    user,
    thread,
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    const updatedThread = await Thread.findByIdAndUpdate(
      thread,
      {
        $inc: { likesCount: -1 },
      },
      {
        new: true,
      },
    );
    revalidatePath(path);

    return {
      liked: false,
      likesCount: updatedThread?.likesCount ?? 0,
    };
  }
  await Like.create({
    user,
    thread,
  });

  const updatedThread = await Thread.findByIdAndUpdate(
    thread,
    {
      $inc: { likesCount: 1 },
    },
    {
      new: true,
    },
  );

  revalidatePath(path);

  return {
    liked: true,
    likesCount: updatedThread?.likesCount ?? 0,
  };
}
 