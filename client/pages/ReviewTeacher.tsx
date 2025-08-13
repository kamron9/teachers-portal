import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Star, Send, Loader2, CheckCircle, BookOpen, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export default function ReviewTeacher() {
  const { lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [categories, setCategories] = useState({
    teaching: 0,
    communication: 0,
    preparation: 0,
    punctuality: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Mock lesson data
  const lesson = {
    id: lessonId,
    teacher: {
      name: "Aziza Karimova",
      title: "English Language Expert",
      image: "/placeholder.svg",
      subjects: ["English", "IELTS"]
    },
    date: "2024-01-15",
    time: "14:00",
    duration: 60,
    type: "Business English",
    student: "John Doe"
  };

  const ratingLabels = {
    1: "Poor",
    2: "Fair", 
    3: "Good",
    4: "Very Good",
    5: "Excellent"
  };

  const categoryLabels = {
    teaching: "Teaching Quality",
    communication: "Communication",
    preparation: "Lesson Preparation",
    punctuality: "Punctuality"
  };

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleCategoryRating = (category: keyof typeof categories, value: number) => {
    setCategories(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Please provide an overall rating");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
    } catch (error) {
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageCategoryRating = Object.values(categories).reduce((sum, rating) => sum + rating, 0) / 4;

  if (isSubmitted) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardContent className="p-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Thank You for Your Review!
                </h1>
                <p className="text-gray-600 mb-8">
                  Your feedback helps us maintain high quality education and helps other students choose the best teachers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/student-dashboard">
                    <Button>
                      Back to Dashboard
                    </Button>
                  </Link>
                  <Link to={`/book-lesson/${lesson.teacher.name.replace(' ', '-').toLowerCase()}`}>
                    <Button variant="outline">
                      Book Another Lesson
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/student-dashboard" className="text-primary hover:text-primary/80">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Rate Your Lesson</h1>
              <p className="text-gray-600">Share your experience to help other students</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Lesson Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Lesson Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={lesson.teacher.image} alt={lesson.teacher.name} />
                    <AvatarFallback className="text-lg">
                      {lesson.teacher.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{lesson.teacher.name}</h3>
                    <p className="text-gray-600">{lesson.teacher.title}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {lesson.teacher.subjects.map((subject) => (
                        <Badge key={subject} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div className="flex items-center gap-1 mb-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(lesson.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="h-4 w-4" />
                      <span>{lesson.time} ({lesson.duration} min)</span>
                    </div>
                    <div className="font-medium">{lesson.type}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Overall Rating */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Rating</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        onClick={() => handleRatingClick(value)}
                        onMouseEnter={() => setHoverRating(value)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-12 w-12 ${
                            value <= (hoverRating || rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 hover:text-yellow-200'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {(hoverRating || rating) > 0 && (
                    <p className="text-lg font-medium text-gray-700">
                      {ratingLabels[(hoverRating || rating) as keyof typeof ratingLabels]}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Category Ratings */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Rating</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <div key={key} className="space-y-2">
                    <Label className="text-base font-medium">{label}</Label>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            onClick={() => handleCategoryRating(key as keyof typeof categories, value)}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                value <= categories[key as keyof typeof categories]
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300 hover:text-yellow-200'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">
                        {categories[key as keyof typeof categories] > 0 && 
                          ratingLabels[categories[key as keyof typeof categories] as keyof typeof ratingLabels]
                        }
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Written Review */}
            <Card>
              <CardHeader>
                <CardTitle>Written Review (Optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="review">
                    Share your experience to help other students
                  </Label>
                  <Textarea
                    id="review"
                    placeholder="What did you like about this lesson? How did the teacher help you? Any suggestions for improvement?"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows={5}
                    className="resize-none"
                  />
                  <div className="text-sm text-gray-500 text-right">
                    {review.length}/500 characters
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="anonymous"
                    checked={isAnonymous}
                    onCheckedChange={setIsAnonymous}
                  />
                  <Label htmlFor="anonymous" className="text-sm">
                    Submit this review anonymously
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Review Summary */}
            {rating > 0 && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-primary">Review Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Overall Rating:</span>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">{rating}/5</span>
                    </div>
                  </div>
                  
                  {averageCategoryRating > 0 && (
                    <div className="flex justify-between items-center">
                      <span>Category Average:</span>
                      <span className="font-medium">{averageCategoryRating.toFixed(1)}/5</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span>Review Length:</span>
                    <span className="font-medium">{review.length} characters</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Visibility:</span>
                    <span className="font-medium">{isAnonymous ? 'Anonymous' : 'Public'}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleSubmit}
                disabled={rating === 0 || isSubmitting}
                className="flex-1"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting Review...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Review
                  </>
                )}
              </Button>
              
              <Link to="/student-dashboard">
                <Button variant="outline" size="lg">
                  Skip for Now
                </Button>
              </Link>
            </div>

            {/* Help Text */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="text-sm text-blue-800">
                  <strong>Why review teachers?</strong>
                  <ul className="mt-2 space-y-1 text-blue-700">
                    <li>• Help other students choose the right teacher</li>
                    <li>• Give teachers feedback to improve their lessons</li>
                    <li>• Build a trustworthy learning community</li>
                    <li>• Your honest feedback is valuable and appreciated</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
