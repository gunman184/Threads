"use client"
import { toggleLike } from "@/lib/actions/toggleLike.actions";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface Props {
  id: string;
  currentUserId: string | undefined;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  likesCount: number;
  isComment?: boolean;
  likedByCurrentUser: boolean;
}

const ThreadCard = ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  likesCount,
  isComment,
  likedByCurrentUser,
}: Props) => {
    const pathname = usePathname();

  const [liked, setLiked] = useState(likedByCurrentUser);
  const [count, setCount] = useState(likesCount);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLike() {
    if (!currentUserId || isLoading) {
      console.log("User is not logged in");
      return;
    }

    const wasLiked = liked;
    setLiked(!wasLiked)
    setCount((prev) => (wasLiked ? prev - 1 : prev + 1))

    setIsLoading(true);

    try {
      const result = await toggleLike({
        user: currentUserId,
        thread: id,
        path: pathname,
      });

      setLiked(result.liked);
      setCount(result.likesCount);
    } catch (error) {
      console.error("Error toggling like:", error);
      setLiked(wasLiked);
      setCount((prev) => (wasLiked ? prev + 1 : prev - 1));

    } finally {
      setIsLoading(false);
    }
  }

  return (
    <article className="flex w-full flex-col rounded-xl bg-dark-3 p-7">
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                alt="Profile Image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>
            <div className="thread-card_bar" />
          </div>
          <div className="flex w-full flex-col">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {" "}
                {author.name}
              </h4>
            </Link>
            <p className="mt-2 text-small-regular text-light-2">{content}</p>
            <div className="mt-5 flex flex-col gap-3">
              <div className="flex gap-3.5">
            
                 {/* LIKE BUTTON */}
                <button
                  type="button"
                  onClick={handleLike}
                  disabled={isLoading || !currentUserId}
                  className="cursor-pointer disabled:cursor-not-allowed" 
                >
                  <Image
                    src={
                      liked
                        ? "/assets/heart-filled.svg"
                        : "/assets/heart.svg"
                    }
                    alt={liked ? "Unlike" : "Like"}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </button>
                <span className="text-light-1">{count}</span>
            
                <Image
                  src="/assets/reply.svg"
                  alt="reply"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Image
                  src="/assets/repost.svg"
                  alt="repost"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Image
                  src="/assets/share.svg"
                  alt="share"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
              </div>
              {isComment && comments.length > 0 && (
                <Link href = {`/thread/${id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">{comments.length} replies</p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
export default ThreadCard;
