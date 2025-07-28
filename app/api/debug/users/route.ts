import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const USERS_FILE = path.join(process.cwd(), "users.json")

function simpleHash(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString()
}

function getUsers(): any[] {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, "utf8")
      return JSON.parse(data)
    }
  } catch (error) {
    console.error("Error reading users file:", error)
  }
  return []
}

export async function GET() {
  const users = getUsers()

  return NextResponse.json({
    total: users.length,
    users: users.map((user) => ({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      user_type: user.user_type,
      created_at: user.created_at,
      hasPassword: !!user.password_hash,
      passwordHashLength: user.password_hash?.length || 0,
    })),
    fileExists: fs.existsSync(USERS_FILE),
  })
}

export async function POST(request: Request) {
  try {
    const { action, email, password } = await request.json()

    if (action === "test_hash") {
      const hash = simpleHash(password)
      return NextResponse.json({
        password,
        hash,
        hashLength: hash.length,
      })
    }

    if (action === "find_user") {
      const users = getUsers()
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

      if (user) {
        return NextResponse.json({
          found: true,
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            hasPassword: !!user.password_hash,
            passwordHash: user.password_hash,
          },
        })
      } else {
        return NextResponse.json({
          found: false,
          availableEmails: users.map((u) => u.email),
        })
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
