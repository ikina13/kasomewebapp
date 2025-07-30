"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation" // Import useRouter
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Users, Clock, ChevronLeft, ChevronRight, Play, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

// Updated Course interface
interface Course {
  id: string | number; // ID can be string or number based on backend
  name: string; // Changed from 'title' to 'name'
  description: string;
  author: string; // Changed from 'instructor' to 'author'
  thumbnail: string; // Changed from 'image' to 'thumbnail' based on previous context
  category?: string; // Made optional if not always present
  price: number;
  currency: string;
  rating?: number; // Made optional
  students?: number; // Made optional
  duration?: string; // Made optional
  // Add any other properties that come from your API here, e.g.,
  // view_count: number;
  // created_at: string;
  // practicle_video_clips: any[];
}

// Define the API response structure
interface ApiResponse {
  status: string;
  message: string;
  data: Course[];
}

const COURSES_PER_SLIDE = 8; // Display 8 courses per slide (e.g., 2 rows of 4)
const COURSES_PER_ROW = 4; // Assuming 4 courses fit well in a row

export default function CoursesGrid() {
  const [allCourses, setAllCourses] = useState<Course[]>([]); // Will eventually hold ALL courses
  const [loading, setLoading] = useState(true); // Tracks if *anything* is loading for initial display
  const [error, setError] = useState<string | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]); // Filters from allCourses

  const router = useRouter(); // Initialize useRouter

  // This useEffect fetches courses from the API progressively
  useEffect(() => {
    let isMounted = true; // To prevent state updates on unmounted component

    const fetchCoursesProgressively = async () => {
      setLoading(true); // Start loading state
      setError(null);

      try {
        const response = await fetch("http://45.79.205.240/api/users/courses");

        if (!isMounted) return; // Exit if component unmounted

        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(errorBody.message || `HTTP error! Status: ${response.status}`);
        }

        const apiResponse: ApiResponse = await response.json();

        if (isMounted) { // Double check after async operations
          if (apiResponse.status === "SUCCESS" && Array.isArray(apiResponse.data)) {
            setAllCourses(apiResponse.data); // Set all courses as they arrive
            setFilteredCourses(apiResponse.data); // Initially filter with all courses

            // Crucially, set loading to false as soon as data (even if partial) is ready
            setLoading(false);
          } else {
            console.warn("API response status was not SUCCESS or data was not an array:", apiResponse);
            setAllCourses([]);
            setFilteredCourses([]);
            setError(apiResponse.message || "No courses found or unexpected API response format.");
            setLoading(false); // Stop loading if error or empty data
          }
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Error fetching courses:", err);
          setAllCourses([]);
          setFilteredCourses([]);
          setError(`Failed to load courses: ${err.message || "Unknown error"}.`);
          setLoading(false); // Stop loading on error
        }
      }
    };

    fetchCoursesProgressively();

    return () => {
      isMounted = false; // Cleanup: Component is unmounting
    };
  }, []); // Runs only once on component mount

  // This useEffect handles filtering when searchQuery or allCourses change
  // Note: This now depends on 'allCourses' to ensure full search capability
  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const newFilteredCourses = allCourses.filter(
      (course) =>
        course.name.toLowerCase().includes(lowerCaseQuery) ||
        course.author.toLowerCase().includes(lowerCaseQuery) ||
        (course.description && course.description.toLowerCase().includes(lowerCaseQuery)) ||
        (course.category && course.category.toLowerCase().includes(lowerCaseQuery))
    );
    setFilteredCourses(newFilteredCourses);
    setCurrentSlideIndex(0); // Reset slide index when filter changes
  }, [searchQuery, allCourses]); // Dependency on allCourses

  const totalSlides = Math.ceil(filteredCourses.length / COURSES_PER_SLIDE);

  const goToNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
  };

  const goToPrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const visibleCourses = filteredCourses.slice(
    currentSlideIndex * COURSES_PER_SLIDE,
    (currentSlideIndex + 1) * COURSES_PER_SLIDE
  );

  const handleViewCourseClick = (courseId: string | number) => {
    const authToken = localStorage.getItem("auth_token");
    if (!authToken) {
      router.push(`/register?redirect_to=/course/${courseId}`);
    } else {
      router.push(`/course/${courseId}`);
    }
  };

  // --- CourseCard component definition (remains unchanged from your provided code) ---
  const CourseCard = ({ course }: { course: Course }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <Image
          src={`http://45.79.205.240/storage/${course.thumbnail}`}
          alt={course.name}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
            target.onerror = null;
          }}
        />
        {course.category && (
          <Badge className="absolute top-2 left-2 bg-blue-600 text-white">{course.category}</Badge>
        )}
        <Badge className="absolute top-2 right-2 bg-white text-black">
          {course.price === 0 ? "Free" : `${course.currency || 'TSh'} ${course.price.toLocaleString()}`}
        </Badge>
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center rounded-t-lg">
          <Play className="h-12 w-12 text-white opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 h-14">{course.name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{course.description}</p>
        <p className="text-sm text-gray-500 mb-3">by {course.author}</p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          {course.rating !== undefined && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{course.rating.toFixed(1)}</span>
            </div>
          )}
          {course.students !== undefined && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{course.students.toLocaleString()} students</span>
            </div>
          )}
          {course.duration && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-green-600">
            {course.currency || 'TSh'} {course.price.toLocaleString()}
          </div>
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => handleViewCourseClick(course.id)}
          >
            View Course
          </Button>
        </div>
      </CardContent>
    </Card>
  );
  // --- End CourseCard component definition ---


  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Render placeholder cards while loading */}
        {Array.from({ length: COURSES_PER_SLIDE }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">Retry Loading</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="max-w-xl mx-auto relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Search courses by name, author, or keywords..."
          className="pl-10 pr-4 py-3 w-full text-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Slider Header and Navigation */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Recommended Courses</h2>
        {filteredCourses.length > 0 && (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrevSlide}
              disabled={totalSlides <= 1 || currentSlideIndex === 0}
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-sm text-gray-500">
              {currentSlideIndex + 1} / {totalSlides}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextSlide}
              disabled={totalSlides <= 1 || currentSlideIndex === totalSlides - 1}
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Course Grid for the current slide */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          <p>No courses found matching your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* First row of visible courses */}
          {visibleCourses.slice(0, COURSES_PER_ROW).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
          {/* Second row of visible courses */}
          {visibleCourses.slice(COURSES_PER_ROW, COURSES_PER_SLIDE).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      {/* "View All Courses" Button (always present) */}
      <div className="text-center mt-8">
        <Button asChild variant="outline" size="lg">
          <Link href="/courses">View All Courses</Link>
        </Button>
      </div>
    </div>
  );
}