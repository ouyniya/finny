import { prisma } from "@/lib/prisma";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";

const app = new Hono().get("/", clerkMiddleware(), async (c) => {
  const auth = getAuth(c);

  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const data = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
      },
      where: {
        id: auth?.userId,
      },
    });

    if (!data) {
      return c.json({ error: "Permission Denied" }, { status: 403 });
    }

    return c.json({ data });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal server error" }, { status: 500 });
  }
});

export default app;
