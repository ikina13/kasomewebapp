"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, User, Settings, LogOut, Edit, Save, X, Play, Clock, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const paidCourses = [
  {
    id: 1,
    title: "Organic Chemistry",
    instructor: "Prof. Sarah Kimani",
    progress: 75,
    totalVideos: 16,
    completedVideos: 12,
    purchaseDate: "2024-01-15",
    image: "/placeholder.svg?height=150&width=200",
  },
  {
    id: 2,
    title: "Cell Biology",
    instructor: "Dr. Peter Msigwa",
    progress: 45,
    totalVideos: 20,
    completedVideos: 9,
    purchaseDate: "2024-02-03",
    image: "/placeholder.svg?height=150&width=200",
  },
  {
    id: 3,
    title: "Advanced Physics",
    instructor: "Dr. James Mwenda",
    progress: 90,
    totalVideos: 24,
    completedVideos: 22,
    purchaseDate: "2024-01-28",
    image: "/placeholder.svg?height=150&width=200",
  },
]

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+255 123 456 789",
    region: "Dar es Salaam",
    district: "Kinondoni",
    school: "Azania Secondary School",
    form: "Form 4",
    gender: "male",
  })

  const [editData, setEditData] = useState(profileData)

  const handleSave = () => {
    setProfileData(editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData(profileData)
    setIsEditing(false)
  }

  const regions = [
    "Arusha",
    "Dar es Salaam",
    "Dodoma",
    "Geita",
    "Iringa",
    "Kagera",
    "Katavi",
    "Kigoma",
    "Kilimanjaro",
    "Lindi",
    "Manyara",
    "Mara",
    "Mbeya",
    "Morogoro",
    "Mtwara",
    "Mwanza",
    "Njombe",
    "Pemba North",
    "Pemba South",
    "Pwani",
    "Rukwa",
    "Ruvuma",
    "Shinyanga",
    "Simiyu",
    "Singida",
    "Songwe",
    "Tabora",
    "Tanga",
    "Unguja North",
    "Unguja South",
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">Kasome</span>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
                Dashboard
              </Link>
              <Link href="/profile" className="text-blue-600 font-medium">
                Profile
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">Profile Information</CardTitle>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} className="flex items-center space-x-2">
                      <Edit className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleSave}
                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                      >
                        <Save className="h-4 w-4" />
                        <span>Save</span>
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="flex items-center space-x-2 bg-transparent"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center space-x-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" />
                    <AvatarFallback className="text-2xl">
                      {profileData.firstName[0]}
                      {profileData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {profileData.firstName} {profileData.lastName}
                    </h3>
                    <p className="text-gray-600">{profileData.email}</p>
                    <Badge className="mt-2">Student Account</Badge>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      First Name
                    </Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={editData.firstName}
                        onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{profileData.firstName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Last Name
                    </Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={editData.lastName}
                        onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{profileData.lastName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{profileData.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number
                    </Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{profileData.phone}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="region" className="text-sm font-medium text-gray-700">
                      Region
                    </Label>
                    {isEditing ? (
                      <select
                        id="region"
                        value={editData.region}
                        onChange={(e) => setEditData({ ...editData, region: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {regions.map((region) => (
                          <option key={region} value={region}>
                            {region}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="mt-1 text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{profileData.region}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="district" className="text-sm font-medium text-gray-700">
                      District
                    </Label>
                    {isEditing ? (
                      <Input
                        id="district"
                        value={editData.district}
                        onChange={(e) => setEditData({ ...editData, district: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{profileData.district}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="school" className="text-sm font-medium text-gray-700">
                      School Name
                    </Label>
                    {isEditing ? (
                      <Input
                        id="school"
                        value={editData.school}
                        onChange={(e) => setEditData({ ...editData, school: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{profileData.school}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="form" className="text-sm font-medium text-gray-700">
                      Form/Class
                    </Label>
                    {isEditing ? (
                      <select
                        id="form"
                        value={editData.form}
                        onChange={(e) => setEditData({ ...editData, form: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Form 1">Form 1</option>
                        <option value="Form 2">Form 2</option>
                        <option value="Form 3">Form 3</option>
                        <option value="Form 4">Form 4</option>
                        <option value="Form 5">Form 5</option>
                        <option value="Form 6">Form 6</option>
                      </select>
                    ) : (
                      <p className="mt-1 text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{profileData.form}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Gender</Label>
                  {isEditing ? (
                    <div className="mt-2 flex space-x-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={editData.gender === "male"}
                          onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                          className="mr-2"
                        />
                        Male
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={editData.gender === "female"}
                          onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                          className="mr-2"
                        />
                        Female
                      </label>
                    </div>
                  ) : (
                    <p className="mt-1 text-gray-900 bg-gray-50 px-3 py-2 rounded-md capitalize">
                      {profileData.gender}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Paid Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">My Paid Courses</CardTitle>
                <p className="text-gray-600">Courses you have purchased and your progress</p>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  {paidCourses.map((course) => (
                    <div
                      key={course.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        <img
                          src={course.image || "/placeholder.svg"}
                          alt={course.title}
                          className="w-full sm:w-32 h-24 object-cover rounded-lg"
                        />

                        <div className="flex-1 space-y-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                            <p className="text-gray-600">by {course.instructor}</p>
                            <p className="text-sm text-gray-500">
                              Purchased on {new Date(course.purchaseDate).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">Progress</span>
                              <span>{course.progress}% Complete</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                            <p className="text-xs text-gray-500">
                              {course.completedVideos} of {course.totalVideos} videos completed
                            </p>
                          </div>

                          <Link href={`/course/${course.id}`}>
                            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                              <Play className="h-4 w-4 mr-2" />
                              Continue Learning
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Learning Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Learning Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">3</div>
                  <div className="text-sm text-blue-700">Courses Purchased</div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">43</div>
                  <div className="text-sm text-green-700">Videos Completed</div>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">28h</div>
                  <div className="text-sm text-purple-700">Total Watch Time</div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <Award className="h-8 w-8 text-yellow-500" />
                  <div>
                    <div className="font-semibold text-yellow-800">First Course</div>
                    <div className="text-xs text-yellow-600">Completed your first course</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Clock className="h-8 w-8 text-blue-500" />
                  <div>
                    <div className="font-semibold text-blue-800">Dedicated Learner</div>
                    <div className="text-xs text-blue-600">20+ hours of learning</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Play className="h-8 w-8 text-green-500" />
                  <div>
                    <div className="font-semibold text-green-800">Video Master</div>
                    <div className="text-xs text-green-600">Watched 40+ videos</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse Courses
                  </Button>
                </Link>

                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>

                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <User className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
