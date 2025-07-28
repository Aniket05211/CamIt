import type React from "react"
export const metadata = {
  title: "Business Opportunities | Your Company",
  description: "Discover how to conduct business with us or build a partnership to grow your business.",
}

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <main>{children}</main>
}
