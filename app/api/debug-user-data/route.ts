import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userData } = await request.json()
    
    console.log("=== DEBUG USER DATA ===")
    console.log("User data received:", userData)
    
    // Check for required fields
    const requiredFields = ['id', 'email', 'full_name', 'name', 'first_name', 'last_name']
    const missingFields = []
    const availableFields = {}
    
    requiredFields.forEach(field => {
      if (userData[field]) {
        availableFields[field] = userData[field]
      } else {
        missingFields.push(field)
      }
    })
    
    console.log("Available fields:", availableFields)
    console.log("Missing fields:", missingFields)
    
    // Generate full_name from available fields
    let fullName = null
    if (userData.full_name) {
      fullName = userData.full_name
    } else if (userData.name) {
      fullName = userData.name
    } else if (userData.first_name && userData.last_name) {
      fullName = `${userData.first_name} ${userData.last_name}`
    } else if (userData.first_name) {
      fullName = userData.first_name
    } else if (userData.last_name) {
      fullName = userData.last_name
    }
    
    console.log("Generated full_name:", fullName)
    
    return NextResponse.json({
      success: true,
      userData,
      availableFields,
      missingFields,
      generatedFullName: fullName,
      hasRequiredFields: {
        id: !!userData.id,
        email: !!userData.email,
        fullName: !!fullName
      }
    })
    
  } catch (error) {
    console.error("Debug user data error:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to debug user data" 
    }, { status: 500 })
  }
} 