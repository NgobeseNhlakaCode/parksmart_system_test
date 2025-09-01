"use client"

import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ParkingLots } from "@/components/parking-lots"
import { PricingCalculator } from "@/components/pricing-calculator"
import { Footer } from "@/components/footer"
import { ZoomMode } from "@/components/zoom-mode"
import { AudioAccessibility } from "@/components/audio-accessibility"
import { Button } from "@/components/ui/button"
import { Smartphone, Download, MapPin, Clock, Shield, Zap } from "lucide-react"

export default function ParkingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
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
        </div>
      </section>

      {/* Mobile App Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Smartphone className="h-6 w-6" />
            <span className="text-lg font-semibold">🚗 Download the ParkSmart Mobile App</span>
          </div>
          <p className="text-blue-100 mb-4">Coming Soon! Get real-time parking updates and book on the go.</p>
          <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
            <Download className="h-4 w-4 mr-2" />
            Get Early Access
          </Button>
        </div>
      </section>

      {/* Parking Lots Section */}
      <ParkingLots />

      {/* Pricing Calculator Section */}
      <PricingCalculator />

      {/* South African Context Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Built for South Africa</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              ParkSmart is designed specifically for South African drivers and parking challenges
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🇿🇦</span>
              </div>
              <h3 className="text-xl font-semibold">Local Payment Methods</h3>
              <p className="text-muted-foreground">
                Pay with SnapScan, Capitec Pay, Zapper, or EFT - all your favorite South African payment options
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold">Load Shedding Aware</h3>
              <p className="text-muted-foreground">
                We show you which parking lots have backup power during load shedding periods
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold">Secure Parking</h3>
              <p className="text-muted-foreground">
                All our partner lots are verified secure zones with 24/7 security monitoring
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Accessibility Components */}
      <ZoomMode />
      <AudioAccessibility />
    </div>
  )
}
