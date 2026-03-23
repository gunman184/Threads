import AccountProfile from "@/components/forms/AccountProfile";
import { currentUser } from "@clerk/nextjs/server";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo: any = {};
  const userData = {
    id: user.id,
    objectId: userInfo?._id || "",
    username: userInfo?.username || user.username,
    name: userInfo?.name || user.firstName || "",
    bio: userInfo?.bio || "",
    image: userInfo?.image || user.imageUrl || "",
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-10 py-20">
      <h1 className="head-text mb-2">Onboarding</h1>
      <p className="text-base-regular text-light-2 mb-8 text-center max-w-md">
        Complete your profiles now to use Threads!
      </p>

      <section className="bg-dark-2 p-10 rounded-md">
        <AccountProfile user={userData} btnTitle="Continue" />
      </section>
    </main>
  );
}

export default Page;
