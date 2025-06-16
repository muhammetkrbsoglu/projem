"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function setRole(formData) {
    const { sessionClaims } = await auth();

    if(sessionClaims?.publicMetadata?.role !== "admin") {
        throw new Error("Unauthorized");
    }

    const id = formData.get("id");
    const role = formData.get("role");

    try {
        await clerkClient.users.updateUser(id, {
            publicMetadata: { role },
        });
        revalidatePath("/admin");
    } catch{ 
        throw new Error("Failed to set user role");
     }
}

export async function removeRole(formData) {
  const { sessionClaims } = await auth();

  if (sessionClaims?.metadata?.role !== "admin") {
    throw new Error("Not Authorized");
  }

  const id = formData.get("id");

  try {
    await clerkClient.users.updateUser(id, {
      publicMetadata: { role: null },
    });
    revalidatePath("/admin");
  } catch {
    throw new Error("Failed to remove role");
  }
}
