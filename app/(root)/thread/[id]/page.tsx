import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser, getUserById } from "@/lib/actions/user.actions";
import Like from "@/lib/models/likes.model";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;
  const user = await currentUser();
  const mongoUser = user ? await getUserById(user.id) : null;

  if (!mongoUser?.onboarded) redirect("/onboarding");
  const thread = await fetchThreadById(params.id);
  const userLikes = mongoUser
    ? await Like.find({
        user: mongoUser._id,
      })
        .select("thread")
        .lean()
    : [];

  const likedThreadsIds = new Set(
    userLikes.map((like) => like.thread.toString()),
  ); // watch out how works the set and map

  return (
    <section className="relative">
      <div>
        <ThreadCard
          key={thread._id.toString()}
          id={thread._id.toString()}
          currentUserId={mongoUser?._id.toString()}
          parentId={thread.parentId?.toString()}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
          likesCount={thread.likesCount}
          likedByCurrentUser={likedThreadsIds.has(thread._id.toString())}
        />
      </div>

      <div className="mt-7">
        <Comment
          threadId={thread.id}
          currentUserImg={mongoUser?.image || "/assets/profile.svg"}
          currentUserId={mongoUser?.id}
        />
      </div>
    </section>
  );
};

export default Page;
