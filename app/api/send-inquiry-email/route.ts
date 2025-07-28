import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      fullName,
      email,
      phone,
      destination,
      travelDates,
      groupSize,
      budget,
      photographyStyle,
      specialRequests,
      hearAboutUs,
    } = body

    // Create email content
    const emailContent = `
New Trip Inquiry from CamIt

Client Information:
- Name: ${fullName}
- Email: ${email}
- Phone: ${phone}

Trip Details:
- Destination: ${destination}
- Travel Dates: ${travelDates}
- Group Size: ${groupSize} people
- Budget: $${budget.toLocaleString()}
- Photography Style: ${photographyStyle}

Special Requests:
${specialRequests || "None specified"}

How they heard about us:
${hearAboutUs || "Not specified"}

---
This inquiry was submitted through the CamIt website.
Please respond to the client within 24 hours.
    `.trim()

    // In a real implementation, you would use a service like:
    // - Resend
    // - SendGrid
    // - Nodemailer with SMTP
    // - AWS SES

    // For now, we'll simulate the email sending
    console.log("Email would be sent to: iamaniket0521@gmail.com")
    console.log("Email content:", emailContent)

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In production, you would integrate with an actual email service:
    /*
    const emailService = new EmailService() // Your chosen email service
    await emailService.send({
      to: 'iamaniket0521@gmail.com',
      subject: `New Trip Inquiry from ${fullName}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>'),
    })
    */

    return NextResponse.json({
      success: true,
      message: "Inquiry submitted successfully",
    })
  } catch (error) {
    console.error("Error processing inquiry:", error)
    return NextResponse.json({ success: false, message: "Failed to process inquiry" }, { status: 500 })
  }
}
