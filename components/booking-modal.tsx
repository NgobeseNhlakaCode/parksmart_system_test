"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Clock, CreditCard, Car, MapPin, CheckCircle, Mail } from "lucide-react"
import { sendBookingConfirmationEmail } from "@/lib/email-service"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  parkingLot: any
}

export function BookingModal({ isOpen, onClose, parkingLot }: BookingModalProps) {
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [licensePlate, setLicensePlate] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [isBooking, setIsBooking] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const paymentMethods = [
    { id: "snapscan", name: "SnapScan", icon: "📱" },
    { id: "capitec", name: "Capitec Pay", icon: "🏦" },
    { id: "zapper", name: "Zapper", icon: "💳" },
    { id: "eft", name: "EFT", icon: "🏛️" },
    { id: "card", name: "Credit/Debit Card", icon: "💳" }
  ]

  const calculatePrice = () => {
    if (!startTime || !endTime) return 0
    
    const start = new Date(`2024-01-01T${startTime}`)
    const end = new Date(`2024-01-01T${endTime}`)
    
    if (end <= start) return 0
    
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    const totalHours = Math.ceil(hours)
    
    // Apply tiered pricing
    let pricePerHour = parkingLot.pricePerHour
    if (totalHours > 6) {
      pricePerHour = Math.max(15, parkingLot.pricePerHour - 10)
    } else if (totalHours > 3) {
      pricePerHour = Math.max(18, parkingLot.pricePerHour - 5)
    }
    
    return totalHours * pricePerHour
  }

  const calculateHours = () => {
    if (!startTime || !endTime) return 0
    
    const start = new Date(`2024-01-01T${startTime}`)
    const end = new Date(`2024-01-01T${endTime}`)
    
    if (end <= start) return 0
    
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    return Math.ceil(hours)
  }

  const handleBooking = async () => {
    if (!startTime || !endTime || !licensePlate || !paymentMethod || !userName || !userEmail) {
      alert("Please fill in all required fields")
      return
    }

    setIsBooking(true)
    
    // Simulate booking process
    setTimeout(async () => {
      setIsBooking(false)
      setBookingComplete(true)
      
      const totalPrice = calculatePrice()
      const totalHours = calculateHours()
      const bookingId = `PS${Date.now()}`
      
      // Save booking to localStorage
      const booking = {
        id: bookingId,
        parkingLot: parkingLot.name,
        address: parkingLot.address,
        startTime,
        endTime,
        licensePlate,
        paymentMethod,
        totalPrice,
        totalHours,
        userName,
        userEmail,
        date: new Date().toISOString(),
        status: "confirmed"
      }
      
      const existingBookings = JSON.parse(localStorage.getItem("parkSmartBookings") || "[]")
      existingBookings.push(booking)
      localStorage.setItem("parkSmartBookings", JSON.stringify(existingBookings))
      
      // Send confirmation email
      try {
        const emailData = {
          userEmail,
          userName,
          parkingLotName: parkingLot.name,
          parkingLotAddress: parkingLot.address,
          startTime,
          endTime,
          licensePlate,
          totalHours,
          totalAmount: totalPrice,
          bookingId,
          paymentMethod: paymentMethods.find(pm => pm.id === paymentMethod)?.name || paymentMethod
        }
        
        const emailSuccess = await sendBookingConfirmationEmail(emailData)
        setEmailSent(emailSuccess)
        
        if (emailSuccess) {
          console.log("✅ Confirmation email sent successfully!")
        } else {
          console.log("❌ Failed to send confirmation email")
        }
      } catch (error) {
        console.error("Error sending email:", error)
        setEmailSent(false)
      }
      
      // Close modal after 5 seconds
      setTimeout(() => {
        onClose()
        setBookingComplete(false)
        setEmailSent(false)
        // Reset form
        setStartTime("")
        setEndTime("")
        setLicensePlate("")
        setPaymentMethod("")
        setUserName("")
        setUserEmail("")
      }, 5000)
    }, 2000)
  }

  const totalPrice = calculatePrice()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-primary" />
            Reserve Parking Spot
          </DialogTitle>
        </DialogHeader>

        {!bookingComplete ? (
          <div className="space-y-6">
            {/* Parking Lot Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{parkingLot.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <MapPin className="h-4 w-4" />
                {parkingLot.address}
              </div>
              <div className="text-sm text-muted-foreground">
                R{parkingLot.pricePerHour}/hour
              </div>
            </div>

            {/* User Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user-name">Full Name *</Label>
                <Input
                  id="user-name"
                  placeholder="Enter your full name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="user-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Time Selection */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time *</Label>
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
                  <Label htmlFor="end-time">End Time *</Label>
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
            </div>

            {/* License Plate */}
            <div className="space-y-2">
              <Label htmlFor="license-plate">Vehicle License Plate *</Label>
              <Input
                id="license-plate"
                placeholder="e.g., CA 123-456"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method *</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      <span className="flex items-center gap-2">
                        <span>{method.icon}</span>
                        {method.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Display */}
            {totalPrice > 0 && (
              <div className="bg-primary/10 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">R{totalPrice}</div>
                <p className="text-sm text-muted-foreground">Total cost for {calculateHours()} hour{calculateHours() > 1 ? 's' : ''}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleBooking} 
                disabled={!startTime || !endTime || !licensePlate || !paymentMethod || !userName || !userEmail || isBooking}
                className="flex-1"
              >
                {isBooking ? "Processing..." : "Confirm Booking"}
              </Button>
            </div>
          </div>
        ) : (
          /* Success State */
          <div className="text-center space-y-4 py-8">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800">Booking Confirmed!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Thank you for your booking, {userName}!
              </p>
            </div>
            
            {/* Email Status */}
            {emailSent ? (
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-700">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm font-medium">Confirmation email sent to {userEmail}</span>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 text-yellow-700">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">Email delivery delayed. Check your spam folder.</span>
                </div>
              </div>
            )}
            
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>Booking Details:</strong><br/>
                {parkingLot.name}<br/>
                {startTime} - {endTime}<br/>
                Total: R{totalPrice} for {calculateHours()} hour{calculateHours() > 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                Show this confirmation at the parking gate. 
                You'll receive a detailed email shortly.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
