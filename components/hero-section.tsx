"use client"

import { Button } from "@/components/ui/button"
import { MapPin, Clock, Shield, Zap } from "lucide-react"

export function HeroSection() {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
          Welcome to ParkSmart!
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Find and reserve parking spots with real-time availability. 
          Built specifically for South African drivers.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          size="lg" 
          className="text-lg px-8 py-6"
          onClick={() => {
            const element = document.getElementById("parking")
            if (element) {
              element.scrollIntoView({ behavior: "smooth" })
            }
          }}
        >
          Find Parking Now
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="text-lg px-8 py-6"
          onClick={() => {
            const element = document.getElementById("pricing")
            if (element) {
              element.scrollIntoView({ behavior: "smooth" })
            }
          }}
        >
          View Pricing
        </Button>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto bg-blue-100 rounded-lg flex items-center justify-center">
            <MapPin className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold">Real-time Availability</h3>
          <p className="text-muted-foreground">
            See exactly how many spots are available at each location
          </p>
        </div>

        <div className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto bg-green-100 rounded-lg flex items-center justify-center">
            <Clock className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold">Instant Booking</h3>
          <p className="text-muted-foreground">
            Reserve your spot in seconds with secure payment options
          </p>
        </div>

        <div className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto bg-purple-100 rounded-lg flex items-center justify-center">
            <Shield className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold">Secure & Safe</h3>
          <p className="text-muted-foreground">
            All partner lots are verified secure zones with 24/7 monitoring
          </p>
        </div>
      </div>

      {/* South African Context */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200 mt-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-2xl">🇿🇦</span>
          <h3 className="text-lg font-semibold text-green-800">Built for South Africa</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span>Load shedding aware with backup power</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">📱</span>
            <span>Local payment methods (SnapScan, Capitec Pay)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
