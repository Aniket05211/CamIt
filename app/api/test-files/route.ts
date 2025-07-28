import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")

export async function GET() {
  try {
    console.log("=== File System Test ===")
    console.log("Data directory:", DATA_DIR)
    console.log("Directory exists:", fs.existsSync(DATA_DIR))

    if (!fs.existsSync(DATA_DIR)) {
      console.log("Creating data directory...")
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }

    const usersFile = path.join(DATA_DIR, "users.json")
    const cameramenFile = path.join(DATA_DIR, "cameramen.json")

    console.log("Users file exists:", fs.existsSync(usersFile))
    console.log("Cameramen file exists:", fs.existsSync(cameramenFile))

    let users = []
    let cameramen = []

    if (fs.existsSync(usersFile)) {
      const usersData = fs.readFileSync(usersFile, "utf8")
      users = JSON.parse(usersData)
      console.log("Users loaded:", users.length)
    }

    if (fs.existsSync(cameramenFile)) {
      const cameramenData = fs.readFileSync(cameramenFile, "utf8")
      cameramen = JSON.parse(cameramenData)
      console.log("Cameramen loaded:", cameramen.length)
    }

    return NextResponse.json({
      success: true,
      data: {
        dataDir: DATA_DIR,
        dirExists: fs.existsSync(DATA_DIR),
        usersFileExists: fs.existsSync(usersFile),
        cameramenFileExists: fs.existsSync(cameramenFile),
        usersCount: users.length,
        cameramenCount: cameramen.length,
        users: users,
        cameramen: cameramen,
      },
    })
  } catch (error) {
    console.error("File test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "File test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
