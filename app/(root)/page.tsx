import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getUserById } from "@/lib/actions/user.actions";
export default function Home() {


  return (

    <div>
      <UserButton/>
      <h2>Hello Man! :D h</h2>
    </div>
  );
}
