import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { fetchPosts } from "@/lib/actions/thread.actions";
import ThreadCard from "@/components/cards/ThreadCard";
import Like from "@/lib/models/likes.model";
import { toggleLike } from "@/lib/actions/toggleLike.actions";
import { getUserById } from "@/lib/actions/user.actions";
export default async function Home() {

  const result = await fetchPosts(1,30);
  const user = await currentUser();
  const mongoUser = user ? await getUserById(user.id) : null;

  const userLikes = mongoUser ? await Like.find({
    user: mongoUser._id,
  }).select("thread").lean() : [];

  const likedThreadsIds = new Set(userLikes.map((like) => like.thread.toString())) // watch out how works the set and map
  return (

    <div>
      <UserButton/>
      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No threads found</p>
        ): (
          <>
            {result.posts.map((post) => (
                
              <ThreadCard
                key={post.id}
                id={post.id}
                currentUserId={mongoUser?.id}      
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
                likesCount={post.likesCount}
                likedByCurrentUser={likedThreadsIds.has(post.id)}
              />
            ))}
          </>
        )}
      </section>
    </div>
  );
}
