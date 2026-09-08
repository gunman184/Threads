"use server";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createThread({
  text,
  author,
  communityId,
  path,
}: Params) {
  connectToDB();

  const createdThread = await Thread.create({
    text,
    author,
    community: null,
  });
  await User.findByIdAndUpdate(author, {
    $push: { threads: createdThread._id },
  });
  revalidatePath(path);
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  await connectToDB();

  const skipAmount = (pageNumber - 1) * pageSize;

  const posts = await Thread.find({
    parentId: { $in: [null, undefined] },
  })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
      select: "_id name image",
    })
    .populate({
      path: "children",
      select: "_id text author createdAt likesCount",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    })
    .lean();

  const totalPostsCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  });

  const serializedPosts = posts.map((post) => ({
    id: post._id.toString(),

    text: post.text,

    parentId: post.parentId ? post.parentId.toString() : null,

    createdAt: post.createdAt.toISOString(),

    likesCount: post.likesCount ?? 0,

    author: {
      id: post.author._id.toString(),
      name: post.author.name,
      image: post.author.image,
    },

    community: null,

    children: post.children.map((child: any) => ({
      author: {
        image: child.author.image,
      },
    })),
  }));

  const isNext = totalPostsCount > skipAmount + posts.length;

  return {
    posts: serializedPosts,
    isNext,
  };
}

export async function fetchThreadById(id: string) {
  await connectToDB();

  try {
    /* const thread = await Thread.findById(id)
      .populate({
        path: 'author',
        model: User,
        select: "_id id name image"
      })
      .populate({
        path: 'children',
        populate: [
          {
            path: 'author',
            model: User,
            select: "_id id name parentId image"
          },
          {
            path: 'children',
            model: Thread,
            populate: {
              path: 'author',
              model: User,
              select: "_id id name parentId image"
            }
          }
        ]
      }).exec();*/
    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id id name image",
        },
      })
      .populate({
        path: "children",
        populate: {
          path: "children",
          populate: {
            path: "author",
            model: User,
            select: "_id id name image",
          },
        },
      })
      .lean();

    return JSON.parse(JSON.stringify(thread));
  } catch (error: any) {
    throw new Error(`Error fetching thread: ${error.message}`);
  }
}
export async function addCommentToThread(threadId: string, commentText:string, userId: string, path:string){
  await connectToDB();
  try{
    const originalThread = await Thread.findById(threadId)

    if(!originalThread){
      throw new Error("Thread not found")
    }

    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId
    })

    
  }catch(error: any){
    throw new Error(`Error adding comment to thread: ${error.message}`)
  }

};
