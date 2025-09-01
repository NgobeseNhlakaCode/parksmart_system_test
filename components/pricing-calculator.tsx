"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator, Clock, CreditCard, AlertCircle } from "lucide-react"

const parkingLots = [
  { id: 1, name: "Eastgate Shopping Centre", pricePerHour: 25 },
  { id: 2, name: "Mall of Africa", pricePerHour: 20 },
  { id: 3, name: "Sandton City", pricePerHour: 15 },
  { id: 4, name: "Rosebank Mall", pricePerHour: 18 },
  { id: 5, name: "Menlyn Park Shopping Centre", pricePerHour: 22 },
  { id: 6, name: "Gateway Theatre of Shopping", pricePerHour: 28 },
  { id: 7, name: "Canal Walk Shopping Centre", pricePerHour: 16 },
  { id: 8, name: "Cavendish Square", pricePerHour: 19 },
  { id: 9, name: "Brooklyn Mall", pricePerHour: 17 },
  { id: 10, name: "Fourways Mall", pricePerHour: 21 },
  { id: 11, name: "V&A Waterfront", pricePerHour: 30 },
  { id: 12, name: "Greenstone Mall", pricePerHour: 18 }
]

export function PricingCalculator() {
  const [selectedLot, setSelectedLot] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [totalPrice, setTotalPrice] = useState(0)
  const [showWarning, setShowWarning] = useState(false)

  const calculatePrice = () => {
    if (!selectedLot || !startTime || !endTime) {
      setShowWarning(true)
      setTotalPrice(0)
      return
    }

    setShowWarning(false)

    const lot = parkingLots.find((l) => l.id.toString() === selectedLot)
    if (!lot) return

    const start = new Date(`2024-01-01T${startTime}`)
    const end = new Date(`2024-01-01T${endTime}`)

    if (end <= start) return

    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    const totalHours = Math.ceil(hours)
    
    // Apply tiered pricing
    let pricePerHour = lot.pricePerHour
    if (totalHours > 6) {
      pricePerHour = Math.max(15, lot.pricePerHour - 10) // Minimum R15/hour for extended stays
    } else if (totalHours > 3) {
      pricePerHour = Math.max(18, lot.pricePerHour - 5) // Discount for half-day stays
    }
    
    const price = totalHours * pricePerHour
    setTotalPrice(price)
  }

  const handleReserve = () => {
    if (totalPrice > 0) {
      alert(`Reservation confirmed! Total: R${totalPrice}`)
    }
  }

  const getTierDescription = () => {
    if (!startTime || !endTime) return ""
    
    const start = new Date(`2024-01-01T${startTime}`)
    const end = new Date(`2024-01-01T${endTime}`)
    if (end <= start) return ""
    
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    const totalHours = Math.ceil(hours)
    
    if (totalHours > 6) return "Extended Stay Discount (6+ hours)"
    if (totalHours > 3) return "Half Day Discount (3-6 hours)"
    return "Standard Rate (1-3 hours)"
  }

  return (
    <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-card-foreground mb-4">Pricing & Time Estimator</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate your parking costs and reserve your spot in advance
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Calculate Parking Cost
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Parking Lot Selection */}
            <div className="space-y-2">
              <Label htmlFor="parking-lot">Select Parking Lot</Label>
              <Select value={selectedLot} onValueChange={setSelectedLot}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a parking lot" />
                </SelectTrigger>
                <SelectContent>
                  {parkingLots.map((lot) => (
                    <SelectItem key={lot.id} value={lot.id.toString()}>
                      {lot.name} - R{lot.pricePerHour}/hour
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="start-time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="end-time"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Warning Message */}
            {showWarning && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  Please select a parking lot and time range to calculate pricing
                </span>
              </div>
            )}

            {/* Calculate Button */}
            <Button onClick={calculatePrice} className="w-full" disabled={!selectedLot || !startTime || !endTime}>
              Calculate Total Price
            </Button>

            {/* Price Display */}
            {totalPrice > 0 && (
              <div className="bg-primary/10 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">R{totalPrice}</div>
                <p className="text-muted-foreground mb-2">Total parking cost for your selected time</p>
                <p className="text-sm text-primary font-medium mb-4">{getTierDescription()}</p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={handleReserve}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Reserve & Pay Later
                  </Button>
                  <Button className="flex-1" onClick={handleReserve}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pre-pay & Reserve
                  </Button>
                </div>
              </div>
            )}

            {/* Pricing Tiers Info */}
            <div className="border-t pt-6">
              <h4 className="font-semibold mb-3">Pricing Tiers</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>1-3 hours</span>
                  <span className="font-medium">Standard Rate</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <span>3-6 hours</span>
                  <span className="font-medium text-blue-600">5% Discount</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span>6+ hours</span>
                  <span className="font-medium text-green-600">10% Discount</span>
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div className="border-t pt-6">
              <h4 className="font-semibold mb-3">Additional Options</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>EV Charging (+R5/hour)</span>
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Valet Service (+R20)</span>
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Car Wash (+R50)</span>
                  <input type="checkbox" className="rounded" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

