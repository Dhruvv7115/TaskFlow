'use client';

import {Skeleton} from "@/components/ui/skeleton";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

export default function RegisterSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full"/>
              <Skeleton className="h-6 w-24"/>
            </div>
            <Skeleton className="h-9 w-24"/>
          </div>
        </div>
      </nav>

      {/* Register Form */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <Skeleton className="h-16 w-16 mx-auto rounded-full"/>
            <Skeleton className="h-8 w-48 mx-auto"/>
            <Skeleton className="h-4 w-64 mx-auto"/>
          </div>

          {/* Card */}
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">
                <Skeleton className="h-6 w-40"/>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-16"/>
                <Skeleton className="h-10 w-full"/>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-16"/>
                <Skeleton className="h-10 w-full"/>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-16"/>
                <Skeleton className="h-10 w-full"/>

                {/* Password Strength */}
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between text-xs">
                    <Skeleton className="h-3 w-16"/>
                    <Skeleton className="h-3 w-12"/>
                  </div>
                  <Skeleton className="h-1.5 w-full"/>
                </div>

                {/* Password Requirements */}
                <div className="space-y-2 mt-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4 rounded-full"/>
                      <Skeleton className="h-3 w-32"/>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-32"/>
                <Skeleton className="h-10 w-full"/>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2 pt-2">
                <Skeleton className="h-4 w-4 mt-1 rounded"/>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-48"/>
                  <Skeleton className="h-3 w-64"/>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Skeleton className="h-10 w-full"/>
              </div>
            </CardContent>

            {/* Login Link */}
            <div className="px-6 py-4 border-t">
              <div className="text-center text-sm">
                <Skeleton className="h-4 w-48 mx-auto"/>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
