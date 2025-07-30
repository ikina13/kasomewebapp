"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Star,
  Clock,
  Users,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Award,
  TrendingUp,
  LogOut,
  Settings,
  Play,
} from "lucide-react"
import Logo from "@/components/Logo"

interface Course {
  id: number
  name: string
  status: string
  thumbnail: string
  created_at: string
  price: number
  author: string
  class_id: number
  subject_id: number
  view_count: number
  practicle_video_clips: any[]
}

interface ApiResponse {
  status: string
  message: string
  data: Course[]
}

// Sample courses for fallback
const sampleCourses: Course[] = [
  {
    id: 1,
    name: "Advanced Mathematics - Form 4",
    status: "active",
    thumbnail: "sample-math.png",
    created_at: "2024-01-15T10:30:00Z",
    price: 0,
    author: "Dr. John Mwalimu",
    class_id: 4,
    subject_id: 1,
    view_count: 1250,
    practicle_video_clips: Array(12).fill({}),
  },
  {
    id: 2,
    name: "Organic Chemistry Basics",
    status: "active",
    thumbnail: "sample-chemistry.png",
    created_at: "2024-01-10T14:20:00Z",
    price: 15000,
    author: "Prof. Sarah Kimani",
    class_id: 3,
    subject_id: 2,
    view_count: 890,
    practicle_video_clips: Array(16).fill({}),
  },
  {
    id: 3,
    name: "Cell Biology - Form 2",
    status: "active",
    thumbnail: "sample-biology.png",
    created_at: "2024-01-08T09:15:00Z",
    price: 12000,
    author: "Dr. Peter Msigwa",
    class_id: 2,
    subject_id: 3,
    view_count: 756,
    practicle_video_clips: Array(20).fill({}),
  },
  {
    id: 4,
    name: "English Literature - Shakespeare",
    status: "active",
    thumbnail: "sample-english.png",
    created_at: "2024-01-05T16:45:00Z",
    price: 0,
    author: "Ms. Grace Mollel",
    class_id: 4,
    subject_id: 4,
    view_count: 1100,
    practicle_video_clips: Array(12).fill({}),
  },
  {
    id: 5,
    name: "Physics Mechanics",
    status: "active",
    thumbnail: "sample-physics.png",
    created_at: "2024-01-03T11:30:00Z",
    price: 18000,
    author: "Dr. Ahmed Hassan",
    class_id: 3,
    subject_id: 5,
    view_count: 945,
    practicle_video_clips: Array(18).fill({}),
  },
  {
    id: 6,
    name: "Geography - Climate Studies",
    status: "active",
    thumbnail: "sample-geography.png",
    created_at: "2024-01-01T08:00:00Z",
    price: 10000,
    author: "Prof. Ocean Mwamba",
    class_id: 2,
    subject_id: 6,
    view_count: 678,
    practicle_video_clips: Array(14).fill({}),
  },
  {
    id: 7,
    name: "History of Tanzania",
    status: "active",
    thumbnail: "sample-history.png",
    created_at: "2023-12-28T13:20:00Z",
    price: 0,
    author: "Dr. Fatuma Ally",
    class_id: 3,
    subject_id: 7,
    view_count: 823,
    practicle_video_clips: Array(10).fill({}),
  },
  {
    id: 8,
    name: "Kiswahili Fasihi",
    status: "active",
    thumbnail: "sample-kiswahili.png",
    created_at: "2023-12-25T15:10:00Z",
    price: 8000,
    author: "Mwalimu Harithi",
    class_id: 4,
    subject_id: 8,
    view_count: 567,
    practicle_video_clips: Array(16).fill({}),
  },
]

export default function DashboardPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [slideIndex, setSlideIndex] = useState(0)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  const coursesPerSlide = 8 // 4 courses per row × 2 rows
  const coursesPerRow = 4

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("auth_token")
    if (!token) {
      router.push("/login")
      return
    }

    // Set mock user data
    setUser({
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "/placeholder.svg?height=40&width=40&text=JD",
    })

    fetchCourses()
  }, [router])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("http://45.79.205.240/api/users/courses")
      const data: ApiResponse = await response.json()

      if (data.status === "SUCCESS" && data.data && data.data.length > 0) {
        setCourses(data.data)
      } else {
        // Use sample courses if API fails or returns no data
        console.log("Using sample courses due to API failure or empty data")
        setCourses(sampleCourses)
        setError("Using sample data - API unavailable")
      }
    } catch (err) {
      console.error("Error fetching courses:", err)
      // Use sample courses on error
      setCourses(sampleCourses)
      setError("Using sample data - Connection failed")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    router.push("/login")
  }

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.author.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalSlides = Math.ceil(filteredCourses.length / coursesPerSlide)

  const nextSlide = () => {
    setSlideIndex((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const visibleCourses = filteredCourses.slice(slideIndex * coursesPerSlide, (slideIndex + 1) * coursesPerSlide)

  const CourseCard = ({ course }: { course: Course }) => (
    <Card className="hover:shadow-lg transition-shadow bg-white">
      <CardHeader className="p-0">
        <div className="relative">
          <img
            src={
              course.thumbnail.startsWith("sample-")
                ? `/placeholder.svg?height=200&width=320&text=${encodeURIComponent(course.name)}`
                : `http://45.79.205.240/storage/${course.thumbnail}`
            }
            alt={course.name}
            className="w-full h-48 object-cover rounded-t-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = `/placeholder.svg?height=200&width=320&text=${encodeURIComponent(course.name)}`
            }}
          />
          <Badge className="absolute top-2 right-2 bg-white text-black">
            {course.price === 0 ? "Free" : `TSh ${course.price.toLocaleString()}`}
          </Badge>
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center rounded-t-lg">
            <Play className="h-12 w-12 text-white opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2 line-clamp-2 h-14">{course.name}</CardTitle>
        <CardDescription className="text-sm text-gray-600 mb-3">By {course.author}</CardDescription>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{new Date(course.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
            <span>4.5</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{course.view_count.toLocaleString()}</span>
          </div>
          <div className="flex items-center">
            <Play className="h-4 w-4 mr-1" />
            <span>{course.practicle_video_clips.length} videos</span>
          </div>
        </div>
        <Link href={`/course/${course.id}`}>
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
            {course.price === 0 ? "Start Learning" : "View Course"}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Logo />
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-yellow-500">
                Home
              </Link>
              <Link href="/dashboard" className="text-gray-900 hover:text-yellow-500">
                Dashboard
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-yellow-500">
                Profile
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <Avatar>
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium">{user.name}</span>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Welcome back, {user?.name?.split(" ")[0] || "Student"}!
              </h1>
              <p className="text-xl opacity-90">Continue your learning journey</p>
            </div>
            <div className="mt-6 md:mt-0 grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold">{filteredCourses.length}</div>
                <div className="text-sm opacity-75">Courses</div>
              </div>
              <div>
                <div className="text-2xl font-bold">85%</div>
                <div className="text-sm opacity-75">Progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold">24h</div>
                <div className="text-sm opacity-75">This Week</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Error Banner */}
      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <p>{error}</p>
            <Button variant="outline" size="sm" onClick={fetchCourses}>
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Courses</p>
                    <p className="text-2xl font-bold">{filteredCourses.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold">8</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold">4</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Certificates</p>
                    <p className="text-2xl font-bold">6</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search courses by name, author, or subject..."
              className="pl-10 pr-4 py-3 w-full text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Courses</h2>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={prevSlide} disabled={totalSlides <= 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-500">
                {slideIndex + 1} / {totalSlides}
              </span>
              <Button variant="ghost" size="sm" onClick={nextSlide} disabled={totalSlides <= 1}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* First Row - 4 courses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {visibleCourses.slice(0, coursesPerRow).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {/* Second Row - 4 courses */}
          {visibleCourses.length > coursesPerRow && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {visibleCourses.slice(coursesPerRow, coursesPerSlide).map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No courses found matching your search.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
