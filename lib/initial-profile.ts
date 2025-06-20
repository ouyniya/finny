import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) return redirect("/sign-in");

  const profile = await prisma.user.findFirst({
    where: {
      id: user?.id,
    },
  });

  if (profile) {
    console.log("User already exit");
    return null;
  }

  const data: Prisma.UserCreateInput = {
    id: user?.id,
    email: user?.emailAddresses[0].emailAddress,
    username: randomUUID(),
    profileImage: "https://picsum.photos/id/29/200/200",
    role: "USER",
  };

  const newProfile = await prisma.user.create({
    data: data,
  });

  return newProfile;
};
