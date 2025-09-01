"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Clock, Car, Zap, Shield, Heart, Filter } from "lucide-react"
import { BookingModal } from "./booking-modal"

const allParkingLots = [
  {
    id: 1,
    name: "Eastgate Shopping Centre",
    address: "43 Bradford Rd, Bedfordview, Johannesburg",
    distance: "0.2 miles",
    availableSpots: 45,
    totalSpots: 200,
    pricePerHour: 25,
    hours: "24/7",
    features: ["EV Charging", "Security", "Handicap"],
    rating: 4.8,
    badges: ["Secure Zone", "24/7", "Wheelchair Friendly"]
  },
  {
    id: 2,
    name: "Mall of Africa",
    address: "Cnr Lone Creek & Magwa Crescent, Waterfall City, Midrand",
    distance: "0.4 miles",
    availableSpots: 12,
    totalSpots: 150,
    pricePerHour: 20,
    hours: "6 AM - 11 PM",
    features: ["Security", "Handicap"],
    rating: 4.5,
    badges: ["Secure Zone", "Backup Power"]
  },
  {
    id: 3,
    name: "Sandton City",
    address: "Cnr Rivonia Rd & 5th St, Sandton, Johannesburg",
    distance: "0.6 miles",
    availableSpots: 89,
    totalSpots: 300,
    pricePerHour: 15,
    hours: "24/7",
    features: ["EV Charging", "Handicap"],
    rating: 4.2,
    badges: ["Secure Zone", "24/7", "Premium Location"]
  },
  {
    id: 4,
    name: "Rosebank Mall",
    address: "50 Bath Ave, Rosebank, Johannesburg",
    distance: "0.8 miles",
    availableSpots: 156,
    totalSpots: 400,
    pricePerHour: 18,
    hours: "8 AM - 10 PM",
    features: ["EV Charging", "Security"],
    rating: 4.6,
    badges: ["Secure Zone", "EV Friendly"]
  },
  {
    id: 5,
    name: "Menlyn Park Shopping Centre",
    address: "Atterbury Rd, Menlyn, Pretoria",
    distance: "1.2 miles",
    availableSpots: 78,
    totalSpots: 250,
    pricePerHour: 22,
    hours: "9 AM - 9 PM",
    features: ["Security", "Handicap", "Covered Parking"],
    rating: 4.4,
    badges: ["Secure Zone", "Covered Parking"]
  },
  {
    id: 6,
    name: "Gateway Theatre of Shopping",
    address: "1 Palm Blvd, Umhlanga Ridge, Durban",
    distance: "1.5 miles",
    availableSpots: 34,
    totalSpots: 180,
    pricePerHour: 28,
    hours: "9 AM - 10 PM",
    features: ["EV Charging", "Security", "Handicap"],
    rating: 4.7,
    badges: ["Secure Zone", "Premium Location", "EV Friendly"]
  },
  {
    id: 7,
    name: "Canal Walk Shopping Centre",
    address: "Century Blvd, Century City, Cape Town",
    distance: "1.8 miles",
    availableSpots: 92,
    totalSpots: 320,
    pricePerHour: 16,
    hours: "9 AM - 9 PM",
    features: ["Security", "Handicap"],
    rating: 4.3,
    badges: ["Secure Zone", "Family Friendly"]
  },
  {
    id: 8,
    name: "Cavendish Square",
    address: "Cnr Main Rd & Cavendish Rd, Claremont, Cape Town",
    distance: "2.1 miles",
    availableSpots: 45,
    totalSpots: 200,
    pricePerHour: 19,
    hours: "8 AM - 8 PM",
    features: ["EV Charging", "Security"],
    rating: 4.5,
    badges: ["Secure Zone", "EV Friendly"]
  },
  {
    id: 9,
    name: "Brooklyn Mall",
    address: "Cnr Bronkhorst St & Veale St, Brooklyn, Pretoria",
    distance: "2.3 miles",
    availableSpots: 67,
    totalSpots: 220,
    pricePerHour: 17,
    hours: "8 AM - 9 PM",
    features: ["Security", "Handicap", "Covered Parking"],
    rating: 4.1,
    badges: ["Secure Zone", "Covered Parking"]
  },
  {
    id: 10,
    name: "Fourways Mall",
    address: "Cnr William Nicol Dr & Fourways Blvd, Fourways, Johannesburg",
    distance: "2.5 miles",
    availableSpots: 123,
    totalSpots: 350,
    pricePerHour: 21,
    hours: "9 AM - 9 PM",
    features: ["EV Charging", "Security", "Handicap"],
    rating: 4.6,
    badges: ["Secure Zone", "EV Friendly", "Family Friendly"]
  },
  {
    id: 11,
    name: "V&A Waterfront",
    address: "Dock Rd, Victoria & Alfred Waterfront, Cape Town",
    distance: "2.8 miles",
    availableSpots: 89,
    totalSpots: 280,
    pricePerHour: 30,
    hours: "24/7",
    features: ["EV Charging", "Security", "Handicap", "Covered Parking"],
    rating: 4.9,
    badges: ["Secure Zone", "24/7", "Premium Location", "Covered Parking"]
  },
  {
    id: 12,
    name: "Greenstone Mall",
    address: "Cnr Modderfontein Rd & Van Riebeeck Ave, Edenvale, Johannesburg",
    distance: "3.0 miles",
    availableSpots: 56,
    totalSpots: 190,
    pricePerHour: 18,
    hours: "8 AM - 8 PM",
    features: ["Security", "Handicap"],
    rating: 4.2,
    badges: ["Secure Zone", "Family Friendly"]
  }
]

export function ParkingLots() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("distance")
  const [filterBy, setFilterBy] = useState("all")
  const [favorites, setFavorites] = useState<number[]>([])
  const [displayedLots, setDisplayedLots] = useState(8)
  const [selectedLot, setSelectedLot] = useState<any>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  const toggleFavorite = (lotId: number) => {
    setFavorites((prev) => (prev.includes(lotId) ? prev.filter((id) => id !== lotId) : [...prev, lotId]))
  }

  const loadMoreLots = () => {
    setDisplayedLots(prev => Math.min(prev + 4, allParkingLots.length))
  }

  const handleReserveSpot = (lot: any) => {
    setSelectedLot(lot)
    setIsBookingModalOpen(true)
  }

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100
    if (percentage > 50) return "text-green-600"
    if (percentage > 20) return "text-yellow-600"
    return "text-red-600"
  }

  const getAvailabilityBadge = (available: number, total: number) => {
    const percentage = (available / total) * 100
    if (percentage > 50)
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          High Availability
        </Badge>
      )
    if (percentage > 20)
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          Medium Availability
        </Badge>
      )
    return (
      <Badge variant="secondary" className="bg-red-100 text-red-800">
        Low Availability
      </Badge>
    )
  }

  // Filter lots based on search term
  const filteredLots = allParkingLots.filter(lot =>
    lot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Apply additional filters
  const applyFilters = (lots: typeof allParkingLots) => {
    switch (filterBy) {
      case "ev":
        return lots.filter(lot => lot.features.includes("EV Charging"))
      case "handicap":
        return lots.filter(lot => lot.features.includes("Handicap"))
      case "security":
        return lots.filter(lot => lot.features.includes("Security"))
      case "24h":
        return lots.filter(lot => lot.hours === "24/7")
      case "covered":
        return lots.filter(lot => lot.features.includes("Covered Parking"))
      default:
        return lots
    }
  }

  // Sort lots
  const sortLots = (lots: typeof allParkingLots) => {
    switch (sortBy) {
      case "distance":
        return [...lots].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
      case "price":
        return [...lots].sort((a, b) => a.pricePerHour - b.pricePerHour)
      case "availability":
        return [...lots].sort((a, b) => (b.availableSpots / b.totalSpots) - (a.availableSpots / a.totalSpots))
      case "rating":
        return [...lots].sort((a, b) => b.rating - a.rating)
      default:
        return lots
    }
  }

  const processedLots = sortLots(applyFilters(filteredLots)).slice(0, displayedLots)

  return (
    <section id="parking" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Available Parking Lots</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time availability and instant booking for parking spots near you
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search parking lots..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="price">Price: Low to High</SelectItem>
                <SelectItem value="availability">Availability</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Lots</SelectItem>
                <SelectItem value="ev">EV Charging</SelectItem>
                <SelectItem value="handicap">Handicap Access</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="24h">24/7 Access</SelectItem>
                <SelectItem value="covered">Covered Parking</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Parking Lots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {processedLots.map((lot) => (
            <Card key={lot.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold mb-1">{lot.name}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {lot.address}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">{lot.distance}</span>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {lot.hours}
                      </div>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm" onClick={() => toggleFavorite(lot.id)} className="ml-2">
                    <Heart
                      className={`h-4 w-4 ${
                        favorites.includes(lot.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"
                      }`}
                    />
                  </Button>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {lot.badges.map((badge) => (
                    <Badge key={badge} variant="secondary" className="text-xs">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Availability */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <span className={`font-semibold ${getAvailabilityColor(lot.availableSpots, lot.totalSpots)}`}>
                      {lot.availableSpots} spots available
                    </span>
                    <span className="text-sm text-muted-foreground">of {lot.totalSpots}</span>
                  </div>
                  {getAvailabilityBadge(lot.availableSpots, lot.totalSpots)}
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {lot.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature === "EV Charging" && <Zap className="h-3 w-3 mr-1" />}
                      {feature === "Security" && <Shield className="h-3 w-3 mr-1" />}
                      {feature}
                    </Badge>
                  ))}
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-primary">R{lot.pricePerHour}/hour</div>
                  <Button size="sm" onClick={() => handleReserveSpot(lot)}>
                    Reserve Spot
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        {displayedLots < allParkingLots.length && (
          <div className="text-center mt-8">
            <Button variant="outline" onClick={loadMoreLots}>
              Load More Parking Lots ({allParkingLots.length - displayedLots} remaining)
            </Button>
          </div>
        )}

        {/* No Results Message */}
        {processedLots.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold">No parking lots found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedLot && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false)
            setSelectedLot(null)
          }}
          parkingLot={selectedLot}
        />
      )}
    </section>
  )
}
