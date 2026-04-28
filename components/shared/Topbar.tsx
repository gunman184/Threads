import { currentUser } from "@clerk/nextjs/server";
import TopbarClient from "./TopbarClient";
import { getUserById } from "@/lib/actions/user.actions";

export default async function Topbar() {

  const user = await currentUser();
  let mongoUser = null;

  if (!user?.id)  return <TopbarClient mongoUser={null} />;

    mongoUser = await getUserById(user.id);
  

  return <TopbarClient mongoUser={mongoUser} />;
}