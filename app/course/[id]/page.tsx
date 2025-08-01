"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Play, Lock, CheckCircle, Users, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner" // Assuming sonner is set up

// --- Interfaces (unchanged) ---
interface VideoClip {
  id: number;
  name: string;
  otp: string;
  status: string;
  playbackInfo: string;
  thumbnail: string;
  practical_video_id: number;
  video_id: string;
  created_at: string;
  created_by: number | null;
  updated_at: string | null;
  updated_by: number | null;
  price: number;
  author: string;
  payment_status: "free" | "buy" | "paid";
  view_count: number;
  comment_count: number;
}

interface FetchedCourse {
  id: number;
  name: string;
  status: string;
  thumbnail: string;
  created_at: string;
  created_by: number;
  updated_at: string;
  updated_by: number;
  price: number;
  author: string;
  class_id: number;
  subject_id: number;
  author_id: number | null;
  view_count: number;
  practicle_video_clips: VideoClip[];
  payment: any | null;
}

interface CourseApiResponse {
  status: string;
  message: string;
  data: FetchedCourse[];
}

interface BackendPaymentTokenResponse {
    status: string;
    code: string;
    token?: string;
    message: string;
}

export default function CoursePage({ params }: { params: { id: string } }) {
  const courseId = params.id;
  const router = useRouter();

  const [course, setCourse] = useState<FetchedCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoClip | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (!courseId) {
      setError("Course ID not provided.");
      setLoading(false);
      return;
    }

    const fetchCourseData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://45.79.205.240/api/users/courses/${courseId}`);

        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(errorBody.message || `Failed to fetch course data: HTTP status ${response.status}`);
        }

        const apiResponse: CourseApiResponse = await response.json();

        if (apiResponse.status === "SUCCESS" && apiResponse.data && apiResponse.data.length > 0) {
          const fetchedCourse = apiResponse.data[0];

          // --- Sorting Logic: Natural sort based on "Qn.X" number ---
          const sortedVideoClips = [...fetchedCourse.practicle_video_clips].sort((a, b) => {
            const regex = /Qn\.(\d+)/;
            const matchA = a.name.match(regex);
            const matchB = b.name.match(regex);

            let numA = Infinity;
            if (matchA && matchA[1]) {
              numA = parseInt(matchA[1], 10);
            }

            let numB = Infinity;
            if (matchB && matchB[1]) {
              numB = parseInt(matchB[1], 10);
            }

            if (numA !== Infinity && numB !== Infinity) {
              return numA - numB;
            }
            if (numA !== Infinity) return -1;
            if (numB !== Infinity) return 1;

            return a.name.localeCompare(b.name);
          });
          fetchedCourse.practicle_video_clips = sortedVideoClips;
          // --- End Sorting Logic ---

          setCourse(fetchedCourse);

          // Find the first free video to set as default (from the now sorted list)
          let defaultVideo: VideoClip | null = null;
          if (fetchedCourse.practicle_video_clips && fetchedCourse.practicle_video_clips.length > 0) {
            defaultVideo = fetchedCourse.practicle_video_clips.find(
              (video) => video.payment_status === "free"
            ) || fetchedCourse.practicle_video_clips[0]; // Fallback to first video if no free ones
          }
          setSelectedVideo(defaultVideo);

        } else {
          setError(apiResponse.message || "Course data not found or invalid response format.");
          setCourse(null);
          setSelectedVideo(null);
        }
      } catch (err: any) {
        console.error("Error fetching course:", err);
        setError(`Error loading course: ${err.message || "Unknown error"}.`);
        setCourse(null);
        setSelectedVideo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const handleVideoClick = (video: VideoClip) => {
    setSelectedVideo(video);
    setShowPaymentModal(false);

    if (video.payment_status === "buy") {
      setShowPaymentModal(true);
    } else {
      // Free video, simply play
    }
  };

  // --- handleProceedToPay function (UNCOMMENTED) ---
  const handleProceedToPay = async () => {
    if (!selectedVideo || !course) {
      toast.error("Course or video not fully loaded for payment.");
      return;
    }

    const authToken = localStorage.getItem("auth_token");

    if (!authToken) {
        toast.error("Authentication required. Please log in first.");
        setShowPaymentModal(false);
        router.push(`/login?redirect_to=/course/${courseId}`);
        return;
    }

    setShowPaymentModal(false); // Close modal immediately
    toast.info("Preparing payment, please wait...", { duration: 5000 });

    // --- UNCOMMENTED CODE BLOCK ---
    try {
        const response = await fetch('http://45.79.205.240/api/users/payment/token', { // Correct URL: no 'i' at the end
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                video_id: course.id, // Sending Course ID
                amount: course.price, // Sending Course Price
                request_from_portal: true, // Sending portal flag
            }),
        });

        const result: BackendPaymentTokenResponse = await response.json();

        if (response.ok && result.status === "SUCCESS" && result.token) {
            const dpoPaymentUrl = `https://secure.3gdirectpay.com/payv3.php?ID=${result.token}`;
            toast.success("Redirecting to DPO payment page...", { duration: 3000 });
            window.location.href = dpoPaymentUrl;
        } else {
            toast.error(result.message || "Failed to initiate payment.");
            console.error("Error from backend payment token API:", result.message);
        }
    } catch (error: any) {
        toast.error(`Payment initiation failed: ${error.message || "Network error"}`);
        console.error("Error during call to backend payment token API:", error);
    }
    // --- END UNCOMMENTED CODE BLOCK ---
  };
  // --- END handleProceedToPay function ---

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
          <Link href="/dashboard" className="ml-4 text-blue-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-600 text-lg mb-4">Course not found.</p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">Kasome</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Video Player and Course Info */}
          <div className="space-y-6">
            {/* Video Player */}
            <Card className="overflow-hidden">
              <div className="relative bg-black aspect-video">
                {selectedVideo ? (
                  selectedVideo.payment_status === "free" ? (
                    <iframe
                      key={selectedVideo.id}
                      src={`https://player.vdocipher.com/v2/?otp=${selectedVideo.otp}&playbackInfo=${selectedVideo.playbackInfo}&autoplay=1`}
                      allowFullScreen={true}
                      allow="encrypted-media; autoplay"
                      className="w-full h-full border-0"
                    ></iframe>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-white">
                        <Lock className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-semibold mb-2">Premium Content</h3>
                        <p className="text-gray-300 mb-4">This video requires payment to unlock.</p>
                        <Button
                          onClick={() => handleVideoClick(selectedVideo)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white"
                        >
                          Buy for TSh {selectedVideo.price.toLocaleString()}
                        </Button>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-800 text-white">
                    <p>No video selected or available for this course.</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Current Video Info */}
            {selectedVideo && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{selectedVideo.name}</CardTitle>
                </CardHeader>
              </Card>
            )}

            {/* Course Information */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{course.name}</CardTitle>
                    <p className="text-lg text-gray-600">by {course.author}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Class {course.class_id}</Badge>
                    <Badge className="bg-green-500 text-white">
                      {course.price === 0 ? "Free" : `TSh ${course.price.toLocaleString()}`}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <Play className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                    <div className="text-sm font-semibold">{course.practicle_video_clips.length}</div>
                    <div className="text-xs text-gray-500">Videos</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <Users className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                    <div className="text-sm font-semibold">{course.view_count.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Views</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <Star className="h-5 w-5 mx-auto mb-1 text-yellow-500 fill-current" />
                    <div className="text-sm font-semibold">N/A</div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Video List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Course Content</CardTitle>
              <p className="text-gray-600">{course.practicle_video_clips.length} video lessons</p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2 p-6">
                {course.practicle_video_clips.length > 0 ? (
                  course.practicle_video_clips.map((video, index) => (
                    <div
                      key={video.id}
                      onClick={() => handleVideoClick(video)}
                      className={`flex items-center p-4 border-2 rounded-lg hover:shadow-md cursor-pointer transition-all ${
                        selectedVideo?.id === video.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {/* Video Thumbnail */}
                      <div className="flex-shrink-0 mr-4">
                        <div className="w-24 h-16 bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                          <Image
                            src={`http://45.79.205.240/storage/${video.thumbnail}`}
                            alt={`Video ${index + 1} thumbnail`}
                            width={96}
                            height={64}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder.svg";
                              target.onerror = null;
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            {video.payment_status === "free" ? (
                              <Play className="h-6 w-6 text-blue-500 bg-white rounded-full p-1" />
                            ) : (
                              <Lock className="h-6 w-6 text-gray-400 bg-white rounded-full p-1" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Video Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h4
                            className={`text-sm font-medium ${
                              selectedVideo?.id === video.id ? "text-blue-700" : "text-gray-900"
                            }`}
                          >
                            {index + 1}. {video.name}
                          </h4>
                          {video.payment_status === "free" && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-green-50 text-green-700 border-green-200 flex-shrink-0 ml-2"
                            >
                              Free
                            </Badge>
                          )}
                          {video.payment_status === "buy" && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200 flex-shrink-0 ml-2"
                            >
                              Buy
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          {video.payment_status === "buy" && (
                            <span className="text-xs font-medium text-yellow-600">TSh {selectedVideo.price.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 p-4">No videos available for this course.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

     {/* Payment Modal */}
      {showPaymentModal && selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Purchase Video: {selectedVideo.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-gray-700">
                {/* IMPORTANT: If paying for the whole course, use course.price here */}
                <p className="text-2xl font-bold text-blue-600 mb-4">TSh {course?.price?.toLocaleString() || selectedVideo.price.toLocaleString()}</p>
                <p className="text-lg font-semibold mb-2">All payments are on monthly basis.</p>
                <p>After each month, you will need to make a new payment.</p>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowPaymentModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 bg-yellow-500 hover:bg-yellow-600" onClick={handleProceedToPay}>
                  Proceed to Pay
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
