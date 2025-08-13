import { Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function PlaceholderPage({ 
  title, 
  description, 
  icon 
}: PlaceholderPageProps) {
  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 space-y-8">
              {/* Icon */}
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                {icon || <MessageCircle className="h-12 w-12 text-primary" />}
              </div>

              {/* Title */}
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {title}
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Coming Soon Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                🚧 Coming Soon
              </div>

              {/* Status Message */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <h3 className="font-semibold text-gray-900">
                  This page is under development
                </h3>
                <p className="text-gray-600 text-sm">
                  We're working hard to bring you this feature. In the meantime, 
                  explore our other sections or get in touch if you need assistance.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Home className="h-5 w-5 mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <Link to="/teachers">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Browse Teachers
                  </Button>
                </Link>
              </div>

              {/* Contact Info */}
              <div className="pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Have questions or suggestions? 
                  <a href="mailto:support@tutoruz.com" className="text-primary hover:underline ml-1">
                    Contact our team
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
