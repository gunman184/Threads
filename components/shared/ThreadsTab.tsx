import { fetchUserPosts, getUserById } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";
import { currentUser } from "@clerk/nextjs/server";
import Like from "@/lib/models/likes.model";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const ThreadsTab = async ({ currentUserId, accountId, accountType }: Props) => {
  const user = await currentUser();
  const mongoUser = user ? await getUserById(user.id) : null;

  if (!mongoUser?.onboarded) redirect("/onboarding");
  let result = await fetchUserPosts(accountId);

    const userLikes = mongoUser
      ? await Like.find({
          user: mongoUser._id,
        })
          .select("thread")
          .lean()
      : [];

  if (!result) redirect("/");
    const likedThreadsIds = new Set(
    userLikes.map((like) => like.thread.toString()),
  ); // watch out how works the set and map

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.threads.map((thread: any) => (
        <ThreadCard
          key={thread._id.toString()}
          id={thread._id.toString()}
          currentUserId={mongoUser?._id.toString()}
          parentId={thread.parentId?.toString()}
          content={thread.text}
          author={
            accountType === 'User'
              ? {name: result.name, image: result.image, id: result._id}
              : {name: thread.author.name, image: thread.author.image, 
                id: thread.author.id
              }

          }
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
          likesCount={thread.likesCount}
          likedByCurrentUser={likedThreadsIds.has(thread._id.toString())}
        />
      ))}
    </section>
  );
};

export default ThreadsTab;
