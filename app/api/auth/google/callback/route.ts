import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("=== GOOGLE CALLBACK DEBUG ===")
    console.log("Environment variables:")
    console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID)
    console.log("GOOGLE_CLIENT_SECRET exists:", !!process.env.GOOGLE_CLIENT_SECRET)
    console.log("GOOGLE_CLIENT_SECRET length:", process.env.GOOGLE_CLIENT_SECRET?.length)
    console.log("NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL)
    
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const error = searchParams.get("error")
    const state = searchParams.get("state") // "signup" or "login"

    console.log("URL parameters:")
    console.log("Code exists:", !!code)
    console.log("Code length:", code?.length)
    console.log("Error:", error)
    console.log("State:", state)

    if (error) {
      console.log("❌ Google OAuth error:", error)
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}`, request.url))
    }

    if (!code) {
      console.log("❌ No authorization code received")
      return NextResponse.redirect(new URL("/login?error=No authorization code received", request.url))
    }

    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`

    console.log("Token exchange parameters:")
    console.log("Client ID:", clientId)
    console.log("Client Secret exists:", !!clientSecret)
    console.log("Redirect URI:", redirectUri)

    if (!clientId || !clientSecret) {
      console.error("❌ Missing Google credentials!")
      return NextResponse.redirect(new URL("/login?error=Google credentials not configured", request.url))
    }

    // Exchange code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error("❌ Token exchange failed!")
      console.error("Status:", tokenResponse.status)
      console.error("Status text:", tokenResponse.statusText)
      console.error("Error response:", errorText)
      return NextResponse.redirect(new URL("/login?error=Failed to exchange authorization code", request.url))
    }

    const tokenData = await tokenResponse.json()
    const { access_token } = tokenData

    // Get user info from Google
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    if (!userInfoResponse.ok) {
      console.error("User info fetch failed:", await userInfoResponse.text())
      return NextResponse.redirect(new URL("/login?error=Failed to fetch user information", request.url))
    }

    const userInfo = await userInfoResponse.json()

    // Send to our Google auth endpoint
    const authResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_token,
        user_info: {
          email: userInfo.email,
          name: userInfo.name,
          sub: userInfo.id,
          picture: userInfo.picture,
        },
        isSignup: state === "signup",
      }),
    })

    if (!authResponse.ok) {
      const errorData = await authResponse.json()
      console.log("Auth response error:", errorData)
      
      // Handle specific error cases
      if (errorData.code === "USER_EXISTS") {
        return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(errorData.error)}`, request.url))
      }
      
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(errorData.error)}`, request.url))
    }

    const authData = await authResponse.json()

    // Redirect based on whether this was a signup or login attempt
    if (state === "signup") {
      // For signup, redirect to login page with success message
      return NextResponse.redirect(new URL("/login?message=Google signup successful! Please log in.", request.url))
    } else {
      // For login, set the session cookie here and redirect to login page with user data (same as email/password)
      const userData = encodeURIComponent(JSON.stringify(authData.user))
      const redirectUrl = new URL(`/login?message=Google authentication successful&user=${userData}`, request.url)
      const response = NextResponse.redirect(redirectUrl)
      
      // Set the session cookie in the redirect response
      if (authData.sessionToken) {
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 7)
        
        response.cookies.set("session_token", authData.sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          expires: expiresAt,
          path: "/",
        })
        
        console.log("=== COOKIE SET DEBUG ===")
        console.log("Session token:", authData.sessionToken)
        console.log("Expires at:", expiresAt)
        console.log("=== END COOKIE DEBUG ===")
      } else {
        console.log("No session token in auth data:", authData)
      }
      
      return response
    }
  } catch (error) {
    console.error("Google callback error:", error)
    return NextResponse.redirect(new URL("/login?error=Authentication failed", request.url))
  }
}
