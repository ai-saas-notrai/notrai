import { withAuth } from "@clerk/nextjs/api";
import prisma from "@/lib/prismadb"; // Ensure this path matches your project structure

export default withAuth(async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Assuming req.auth.userId could be string | undefined
    const userId = req.auth.userId || undefined; // Convert null to undefined

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: No user ID" });
    }

    const userDetails = await prisma.user.findUnique({
      where: { userId }, // Now userId is string | undefined, matching Prisma's expectation
    });

    if (!userDetails) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(userDetails);
  } catch (error) {
    console.error("[ERROR]", error);
    res.status(500).json({ error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" });
  }
});
