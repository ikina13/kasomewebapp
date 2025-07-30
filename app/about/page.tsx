import Link from "next/link"
import { BookOpen, Users, Award, Globe, Target, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
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
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                Home
              </Link>
              <Link href="/about" className="text-blue-600 font-medium">
                About Us
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">
                Contact
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">About Kasome</h1>
          <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto">
            Transforming secondary education in Tanzania through accessible, high-quality video learning experiences
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Statement */}
        <section className="mb-16">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8 sm:p-12">
              <div className="text-center mb-8">
                <Target className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              </div>

              <div className="prose prose-lg max-w-4xl mx-auto text-gray-700 leading-relaxed">
                <p className="text-xl mb-6">
                  <strong>Kasome is an online video library that students can use as tuition sessions.</strong>
                  These videos are produced by Kasome project and uploaded to our website and App. The aim is to make
                  secondary studies easy to be accessible and understood by connecting the very best teachers, who have
                  excellent experience and are highly professional, to students all over Tanzania, through their
                  smartphone, computers, smart TVs in schools.
                </p>

                <p className="text-lg mb-6">
                  Kasome enhances the school experience for students, enabling them to refresh on any topic in their
                  curriculum. We create a tool that provides equal access to high-quality lessons that students can
                  learn at their own pace, time, and at their convenient places.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Background and Justification */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Background and Justification</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Understanding the challenges facing secondary education in Tanzania
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-red-800 flex items-center">
                  <span className="mr-2">📊</span>
                  The Challenge
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                <p className="mb-4">
                  According to the 2024 National Examination Council of Tanzania (NECTA) Form Four results,
                  <strong className="text-red-600"> over 74% of students scored zero in mathematics</strong>.
                </p>

                <p className="mb-4">The majority of government secondary schools are characterized by:</p>

                <ul className="space-y-2 list-disc list-inside">
                  <li>A shortage of competent teachers, especially in STEM subjects</li>
                  <li>Overcrowded classrooms with little individualized support</li>
                  <li>
                    Language barriers, as English is the medium of instruction in secondary schools, yet students are
                    coming from Kiswahili-medium primary schools
                  </li>
                  <li>
                    High dropout rates, particularly among girls, due to challenges like long commutes, financial
                    hardship, and vulnerability to harassment when accessing extra tuition outside the school
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-blue-800 flex items-center">
                  <span className="mr-2">💡</span>
                  Our Solution
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                <p className="mb-4">
                  <strong>Kasome International was founded to address these systemic issues.</strong>
                  During the 2020 COVID-19 pandemic, our platform was trusted by the Tanzania Institute of Education
                  (TIE) and our content was aired via various national TV channels as part of the national education
                  recovery effort.
                </p>

                <p className="mb-4">
                  We are now building on this impact to reach even more learners in underserved areas.
                </p>

                <p>
                  Our success is driven by high-level expertise from our supportive team of staff and their commitment
                  towards getting results through the right way by operating responsibly, executing with excellence,
                  applying innovative technologies, and capturing new opportunities for creative teaching and learning
                  environments for profitable growth and success of our esteemed students.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Our Impact */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-xl text-gray-600">Making a difference in Tanzanian education</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-blue-800 mb-2">10,000+</div>
                <div className="text-blue-700 font-medium">Students Reached</div>
              </CardContent>
            </Card>

            <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <BookOpen className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-green-800 mb-2">500+</div>
                <div className="text-green-700 font-medium">Video Lessons</div>
              </CardContent>
            </Card>

            <Card className="text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <Award className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-purple-800 mb-2">50+</div>
                <div className="text-purple-700 font-medium">Expert Teachers</div>
              </CardContent>
            </Card>

            <Card className="text-center bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <Globe className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-orange-800 mb-2">26</div>
                <div className="text-orange-700 font-medium">Regions Covered</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <Heart className="h-16 w-16 text-red-500 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">Accessibility</h3>
                <p className="text-gray-600">
                  Making quality education accessible to every student, regardless of their location or economic
                  background.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <Award className="h-16 w-16 text-blue-500 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">Excellence</h3>
                <p className="text-gray-600">
                  Delivering the highest quality educational content through experienced and professional teachers.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <Target className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">Innovation</h3>
                <p className="text-gray-600">
                  Using cutting-edge technology to create engaging and effective learning experiences.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Join the Kasome Community</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Be part of the educational transformation in Tanzania. Start your learning journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3">
                Get Started Today
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-3 bg-transparent"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">Kasome</span>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                Making secondary education accessible to all Tanzanian students through high-quality video lessons from
                expert teachers.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="text-gray-300 hover:text-white">
                    All Courses
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-gray-300 hover:text-white">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Account</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/login" className="text-gray-300 hover:text-white">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-gray-300 hover:text-white">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-gray-300 hover:text-white">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="text-gray-300 hover:text-white">
                    My Profile
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2024 Kasome International. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
