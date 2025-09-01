// Email service utility for sending booking confirmations
// Supports Gmail SMTP and other email services

export interface BookingEmailData {
  userEmail: string
  userName: string
  parkingLotName: string
  parkingLotAddress: string
  startTime: string
  endTime: string
  licensePlate: string
  totalHours: number
  totalAmount: number
  bookingId: string
  paymentMethod: string
}

// Gmail SMTP Configuration
const GMAIL_CONFIG = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.GMAIL_USER || 'your-email@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'your-app-password'
  }
}

// Alternative: Using Gmail API (more secure)
const GMAIL_API_CONFIG = {
  clientId: process.env.GMAIL_CLIENT_ID,
  clientSecret: process.env.GMAIL_CLIENT_SECRET,
  refreshToken: process.env.GMAIL_REFRESH_TOKEN,
  accessToken: process.env.GMAIL_ACCESS_TOKEN
}

export const sendBookingConfirmationEmail = async (bookingData: BookingEmailData): Promise<boolean> => {
  try {
    const emailContent = generateEmailContent(bookingData)
    
    // Check if we're in development or production
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    if (isDevelopment) {
      // In development, simulate email sending and log to console
      console.log('📧 Development Mode - Email would be sent:', {
        to: bookingData.userEmail,
        subject: `ParkSmart Booking Confirmation - ${bookingData.parkingLotName}`,
        from: GMAIL_CONFIG.auth.user,
        content: emailContent.substring(0, 200) + '...' // Truncate for console
      })
      
      // Store email in localStorage for demo purposes
      const emails = JSON.parse(localStorage.getItem('parkSmartEmails') || '[]')
      emails.push({
        id: Date.now(),
        to: bookingData.userEmail,
        from: GMAIL_CONFIG.auth.user,
        subject: `ParkSmart Booking Confirmation - ${bookingData.parkingLotName}`,
        content: emailContent,
        timestamp: new Date().toISOString()
      })
      localStorage.setItem('parkSmartEmails', JSON.stringify(emails))
      
      return true
    } else {
      // In production, send actual email
      return await sendActualEmail(bookingData, emailContent)
    }
    
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}

const sendActualEmail = async (bookingData: BookingEmailData, emailContent: string): Promise<boolean> => {
  try {
    // Method 1: Using Gmail SMTP with Nodemailer (requires server-side)
    if (typeof window === 'undefined') {
      // Server-side code
      const nodemailer = require('nodemailer')
      
      const transporter = nodemailer.createTransporter({
        host: GMAIL_CONFIG.host,
        port: GMAIL_CONFIG.port,
        secure: GMAIL_CONFIG.secure,
        auth: GMAIL_CONFIG.auth
      })
      
      const mailOptions = {
        from: `"ParkSmart" <${GMAIL_CONFIG.auth.user}>`,
        to: bookingData.userEmail,
        subject: `ParkSmart Booking Confirmation - ${bookingData.parkingLotName}`,
        html: emailContent
      }
      
      const info = await transporter.sendMail(mailOptions)
      console.log('Email sent successfully:', info.messageId)
      return true
    }
    
    // Method 2: Using EmailJS (client-side)
    if (typeof window !== 'undefined' && (window as any).emailjs) {
      const emailjs = (window as any).emailjs
      
      const templateParams = {
        to_email: bookingData.userEmail,
        to_name: bookingData.userName,
        parking_lot: bookingData.parkingLotName,
        booking_id: bookingData.bookingId,
        total_amount: `R${bookingData.totalAmount}`,
        start_time: bookingData.startTime,
        end_time: bookingData.endTime
      }
      
      const result = await emailjs.send(
        'YOUR_EMAILJS_SERVICE_ID', // Replace with your EmailJS service ID
        'YOUR_EMAILJS_TEMPLATE_ID', // Replace with your EmailJS template ID
        templateParams,
        'YOUR_EMAILJS_USER_ID' // Replace with your EmailJS user ID
      )
      
      console.log('EmailJS result:', result)
      return true
    }
    
    // Method 3: Using a third-party email service API
    return await sendViaEmailServiceAPI(bookingData, emailContent)
    
  } catch (error) {
    console.error('Error sending actual email:', error)
    return false
  }
}

const sendViaEmailServiceAPI = async (bookingData: BookingEmailData, emailContent: string): Promise<boolean> => {
  try {
    // Example using a service like SendGrid, Mailgun, or Resend
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: bookingData.userEmail,
        subject: `ParkSmart Booking Confirmation - ${bookingData.parkingLotName}`,
        html: emailContent,
        from: 'noreply@parksmart.co.za'
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('Email sent via API:', result)
      return true
    } else {
      console.error('Failed to send email via API:', response.statusText)
      return false
    }
  } catch (error) {
    console.error('Error sending email via API:', error)
    return false
  }
}

const generateEmailContent = (data: BookingEmailData): string => {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-ZA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">🚗 ParkSmart</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Your Parking Booking Confirmation</p>
      </div>
      
      <div style="background: white; padding: 30px; border: 1px solid #e1e5e9; border-radius: 0 0 10px 10px;">
        <h2 style="color: #2d3748; margin-bottom: 20px;">Thank you for your booking, ${data.userName}!</h2>
        
        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #2d3748; margin-top: 0;">📋 Booking Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #4a5568;"><strong>Booking ID:</strong></td>
              <td style="padding: 8px 0; color: #2d3748;">${data.bookingId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #4a5568;"><strong>Parking Location:</strong></td>
              <td style="padding: 8px 0; color: #2d3748;">${data.parkingLotName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #4a5568;"><strong>Address:</strong></td>
              <td style="padding: 8px 0; color: #2d3748;">${data.parkingLotAddress}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #4a5568;"><strong>Date:</strong></td>
              <td style="padding: 8px 0; color: #2d3748;">${formatDate(data.startTime)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #4a5568;"><strong>Start Time:</strong></td>
              <td style="padding: 8px 0; color: #2d3748;">${formatTime(data.startTime)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #4a5568;"><strong>End Time:</strong></td>
              <td style="padding: 8px 0; color: #2d3748;">${formatTime(data.endTime)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #4a5568;"><strong>Duration:</strong></td>
              <td style="padding: 8px 0; color: #2d3748;">${data.totalHours} hour${data.totalHours > 1 ? 's' : ''}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #4a5568;"><strong>Vehicle:</strong></td>
              <td style="padding: 8px 0; color: #2d3748;">${data.licensePlate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #4a5568;"><strong>Payment Method:</strong></td>
              <td style="padding: 8px 0; color: #2d3748;">${data.paymentMethod}</td>
            </tr>
          </table>
        </div>
        
        <div style="background: #e6fffa; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #38b2ac;">
          <h3 style="color: #2d3748; margin-top: 0;">💰 Total Amount</h3>
          <div style="font-size: 24px; font-weight: bold; color: #38b2ac;">R${data.totalAmount}</div>
          <p style="margin: 5px 0 0 0; color: #4a5568; font-size: 14px;">Payment processed successfully</p>
        </div>
        
        <div style="background: #fffaf0; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ed8936;">
          <h3 style="color: #2d3748; margin-top: 0;">⚠️ Important Information</h3>
          <ul style="color: #4a5568; margin: 0; padding-left: 20px;">
            <li>Please arrive at least 10 minutes before your start time</li>
            <li>Show this confirmation email at the parking gate</li>
            <li>Keep your vehicle registration number handy</li>
            <li>For support, contact us at support@parksmart.co.za</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #4a5568; margin-bottom: 20px;">Thank you for choosing ParkSmart!</p>
          <div style="color: #718096; font-size: 14px;">
            <p>🇿🇦 Built for South Africa</p>
            <p>Midrand, South Africa | Building 2 Constantia Park, 546 16th Rd</p>
            <p>support@parksmart.co.za | +27 11 123 4567</p>
          </div>
        </div>
      </div>
    </div>
  `
}

// Helper function to get stored emails (for demo purposes)
export const getStoredEmails = () => {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem('parkSmartEmails') || '[]')
  }
  return []
}
