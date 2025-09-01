# 🚀 Gmail Email Server Setup Guide

This guide will help you set up Gmail to send booking confirmation emails from your ParkSmart application.

## 📋 Prerequisites

1. A Gmail account
2. 2-Step Verification enabled on your Gmail account
3. Node.js and npm/pnpm installed

## 🔧 Setup Steps

### Step 1: Enable 2-Step Verification

1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", click "2-Step Verification"
4. Follow the steps to enable 2-Step Verification

### Step 2: Generate App Password

1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", click "App passwords"
4. Select "Mail" as the app and "Other" as the device
5. Click "Generate"
6. Copy the 16-character password (you'll only see it once!)

### Step 3: Install Dependencies

```bash
# Install nodemailer for email functionality
npm install nodemailer
npm install @types/nodemailer --save-dev

# Or with pnpm
pnpm add nodemailer
pnpm add -D @types/nodemailer
```

### Step 4: Create Environment Variables

Create a `.env.local` file in your project root:

```env
# Gmail SMTP Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password

# Environment
NODE_ENV=development
```

### Step 5: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Make a test booking on your website
3. Check the console for email logs
4. Check your email inbox for the confirmation

## 🔒 Security Best Practices

### ✅ Do's:
- Use App Passwords instead of your regular Gmail password
- Keep your `.env.local` file secure and never commit it to version control
- Use environment variables for all sensitive data
- Enable 2-Step Verification on your Gmail account

### ❌ Don'ts:
- Never use your regular Gmail password
- Don't commit `.env.local` to Git
- Don't share your app password publicly
- Don't use the same app password for multiple applications

## 🚀 Production Deployment

### Option 1: Vercel (Recommended)

1. Add environment variables in Vercel dashboard:
   - Go to your project settings
   - Add `GMAIL_USER` and `GMAIL_APP_PASSWORD`
   - Set `NODE_ENV=production`

2. Deploy your application

### Option 2: Other Hosting Platforms

Add the same environment variables to your hosting platform's dashboard.

## 📧 Email Service Alternatives

### 1. EmailJS (Client-side)
- No server required
- Free tier available
- Easy to set up

### 2. SendGrid
- Professional email service
- High deliverability
- Good for production

### 3. Mailgun
- Developer-friendly
- Good documentation
- Reasonable pricing

### 4. Resend
- Modern email API
- Great developer experience
- Good free tier

## 🔍 Troubleshooting

### Common Issues:

1. **"Invalid login" error**
   - Make sure you're using an App Password, not your regular password
   - Ensure 2-Step Verification is enabled

2. **"Less secure app access" error**
   - Use App Passwords instead of regular passwords
   - This is the recommended approach

3. **"Authentication failed" error**
   - Double-check your Gmail username and app password
   - Make sure there are no extra spaces

4. **Emails not sending in production**
   - Check that environment variables are set correctly
   - Verify `NODE_ENV=production` is set

### Testing:

```javascript
// Test email sending
const testEmail = async () => {
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: 'test@example.com',
      subject: 'Test Email',
      html: '<h1>Test Email</h1><p>This is a test email from ParkSmart.</p>'
    })
  })
  
  const result = await response.json()
  console.log('Email result:', result)
}
```

## 📞 Support

If you encounter issues:

1. Check the console for error messages
2. Verify your Gmail settings
3. Test with a simple email first
4. Check your spam folder for test emails

## 🎯 Next Steps

Once Gmail is working:

1. Customize the email template in `lib/email-service.ts`
2. Add email tracking and analytics
3. Set up email templates for different scenarios
4. Implement email scheduling for reminders

---

**Happy emailing! 🚗📧**
