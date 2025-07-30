import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Try to fetch from your external API first
    const response = await fetch("http://45.79.205.240/api/users/courses")
    const responseText = await response.text()

    // Try to parse as JSON
    let data
    try {
      data = JSON.parse(responseText)
      console.log(data);
    } catch (parseError) {
      console.log("Failed to parse API response as JSON:", responseText.substring(0, 100))
      throw new Error("Invalid JSON response")
    }

    // Check if the response has the expected structure
    if (data && data.status === "success" && Array.isArray(data.data)) {
      return NextResponse.json(data.data)
    } else {
      throw new Error("Unexpected API response structure")
    }
  } catch (error) {
    console.log("API Error:", error)

    // Return sample courses as fallback
    const sampleCourses = [
      {
        id: "1",
        title: "Advanced Mathematics for Form 4",
        description: "Master calculus, algebra, and geometry for NECTA exams",
        instructor: "Dr. Amina Hassan",
        image: "/placeholder.svg?height=200&width=300&text=Mathematics",
        category: "Mathematics",
        price: 45000,
        currency: "TZS",
        rating: 4.8,
        students: 234,
        duration: "12 weeks",
      },
      {
        id: "2",
        title: "Chemistry Fundamentals",
        description: "Complete chemistry course covering organic and inorganic chemistry",
        instructor: "Prof. John Mwalimu",
        image: "/placeholder.svg?height=200&width=300&text=Chemistry",
        category: "Science",
        price: 38000,
        currency: "TZS",
        rating: 4.7,
        students: 189,
        duration: "10 weeks",
      },
      {
        id: "3",
        title: "English Literature & Writing",
        description: "Improve your English skills with literature analysis and creative writing",
        instructor: "Ms. Grace Kimaro",
        image: "/placeholder.svg?height=200&width=300&text=English",
        category: "Languages",
        price: 32000,
        currency: "TZS",
        rating: 4.9,
        students: 312,
        duration: "8 weeks",
      },
      {
        id: "4",
        title: "Physics for Advanced Level",
        description: "Comprehensive physics course covering mechanics, waves, and electricity",
        instructor: "Dr. Peter Msigwa",
        image: "/placeholder.svg?height=200&width=300&text=Physics",
        category: "Science",
        price: 42000,
        currency: "TZS",
        rating: 4.6,
        students: 156,
        duration: "14 weeks",
      },
      {
        id: "5",
        title: "Computer Science Basics",
        description: "Introduction to programming, algorithms, and computer systems",
        instructor: "Eng. Sarah Mwanza",
        image: "/placeholder.svg?height=200&width=300&text=Computer+Science",
        category: "Technology",
        price: 55000,
        currency: "TZS",
        rating: 4.8,
        students: 278,
        duration: "16 weeks",
      },
      {
        id: "6",
        title: "Biology & Life Sciences",
        description: "Explore human biology, genetics, and environmental science",
        instructor: "Dr. Michael Ndege",
        image: "/placeholder.svg?height=200&width=300&text=Biology",
        category: "Science",
        price: 40000,
        currency: "TZS",
        rating: 4.7,
        students: 203,
        duration: "12 weeks",
      },
      {
        id: "7",
        title: "History of Tanzania",
        description: "Learn about Tanzanian history from pre-colonial times to modern day",
        instructor: "Prof. Fatuma Chande",
        image: "/placeholder.svg?height=200&width=300&text=History",
        category: "Social Studies",
        price: 28000,
        currency: "TZS",
        rating: 4.5,
        students: 145,
        duration: "6 weeks",
      },
      {
        id: "8",
        title: "Geography & Environmental Science",
        description: "Study physical geography, climate, and environmental conservation",
        instructor: "Dr. James Mollel",
        image: "/placeholder.svg?height=200&width=300&text=Geography",
        category: "Social Studies",
        price: 35000,
        currency: "TZS",
        rating: 4.6,
        students: 167,
        duration: "10 weeks",
      },
    ]

    return NextResponse.json(sampleCourses)
  }
}
