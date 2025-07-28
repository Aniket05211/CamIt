import { cookies } from "next/headers"
import { authService } from "./auth"

export async function createSession(userId: string): Promise<string> {
  const sessionToken = authService.generateSessionToken(userId)

  // Set HTTP-only cookie
  const cookieStore = await cookies()
  cookieStore.set("camit_session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  })

  return sessionToken
}

export async function getSession(): Promise<any | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("camit_session")?.value

    if (!sessionToken) {
      return null
    }

    return await authService.validateSession(sessionToken)
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export async function destroySession(): Promise<void> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("camit_session")?.value

    if (sessionToken) {
      await authService.logout(sessionToken)
    }

    // Clear cookie
    cookieStore.delete("camit_session")
  } catch (error) {
    console.error("Error destroying session:", error)
  }
}
