import { useState, useEffect } from "react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Send, Loader2, CheckCircle, BookOpen, Clock, User, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useCreateReview, useBooking } from "@/hooks/useApi";
import { formatTimezone } from "@/lib/api";

export default function ReviewTeacher() {
  const { lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const bookingId = searchParams.get("bookingId") || lessonId;
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Fetch booking details
  const { data: booking, isLoading: bookingLoading } = useBooking(bookingId || "", !!bookingId);

  // Review submission mutation
  const createReviewMutation = useCreateReview();

  const ratingLabels = {
    1: "Poor",
    2: "Fair", 
    3: "Good",
    4: "Very Good",
    5: "Excellent"
  };

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Error",
        description: "Please provide a rating",
        variant: "destructive",
      });
      return;
    }

    if (!booking) {
      toast({
        title: "Error",
        description: "Booking information not found",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createReviewMutation.mutateAsync({
        teacherId: booking.teacher?.id || "",
        bookingId: booking.id,
        rating,
        comment: review.trim() || undefined,
        isAnonymous,
      });
      
      setIsSubmitted(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookingLoading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading lesson details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Lesson not found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the lesson you're trying to review.</p>
          <Button onClick={() => navigate("/student-dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Review Submitted Successfully!
                </h2>
                <p className="text-gray-600 mb-8">
                  Thank you for your feedback. Your review helps other students make informed decisions and helps teachers improve their teaching.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigate("/student-dashboard")}>
                    Back to Dashboard
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate(`/teacher-details/${booking.teacher?.id}`)}
                  >
                    View Teacher Profile
                  </Button>
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
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/student-dashboard" className="text-primary hover:text-primary/80">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Review Teacher</h1>
              <p className="text-gray-600">Share your experience with this lesson</p>
            </div>
          </div>

          {/* Lesson Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Lesson Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage 
                    src={booking.teacher?.avatar || "/placeholder.svg"} 
                    alt={`${booking.teacher?.firstName} ${booking.teacher?.lastName}`}
                  />
                  <AvatarFallback>
                    {booking.teacher?.firstName?.[0]}{booking.teacher?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {booking.teacher?.firstName} {booking.teacher?.lastName}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {booking.subjectOffering?.subjectName}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                      <span>{formatTimezone(booking.startAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>
                        {Math.round((new Date(booking.endAt).getTime() - new Date(booking.startAt).getTime()) / (1000 * 60))} minutes
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-gray-400" />
                      <Badge variant={booking.type === "TRIAL" ? "secondary" : "default"}>
                        {booking.type.toLowerCase()} lesson
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Rate Your Experience</CardTitle>
              <p className="text-sm text-gray-600">
                How would you rate this lesson overall?
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-10 w-10 ${
                          star <= (hoverRating || rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {(hoverRating || rating) > 0 && (
                  <p className="text-lg font-medium text-gray-700">
                    {ratingLabels[hoverRating || rating as keyof typeof ratingLabels]}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Written Review */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Written Review (Optional)</CardTitle>
              <p className="text-sm text-gray-600">
                Share details about your experience to help other students
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="review">Your Review</Label>
                  <Textarea
                    id="review"
                    placeholder="What did you like about this lesson? How could it be improved?"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows={5}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {review.length}/500 characters
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="anonymous"
                    checked={isAnonymous}
                    onCheckedChange={setIsAnonymous}
                  />
                  <Label 
                    htmlFor="anonymous" 
                    className="text-sm font-normal cursor-pointer"
                  >
                    Submit this review anonymously
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Review
                </>
              )}
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/student-dashboard")}
              disabled={isSubmitting}
            >
              Skip for Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
