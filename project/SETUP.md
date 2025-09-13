# InflueConnect Setup Instructions

## Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account
- Cloudinary account
- EmailJS account (for notifications)

## 1. MongoDB Atlas Setup

### Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (choose the free tier)
4. Wait for cluster to be created (5-10 minutes)

### Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username and password (save these!)
5. Set user privileges to "Read and write to any database"
6. Click "Add User"

### Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0) for development
4. Click "Confirm"

### Get Connection String
1. Go to "Clusters" and click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `influeconnect`

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/influeconnect?retryWrites=true&w=majority
```

## 2. Cloudinary Setup

### Create Cloudinary Account
1. Go to [Cloudinary](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email address

### Get API Credentials
1. Go to your Cloudinary Dashboard
2. Copy the following values:
   - Cloud Name
   - API Key
   - API Secret

### Configure Upload Presets (Optional)
1. Go to Settings > Upload
2. Click "Add upload preset"
3. Set preset name to `influencer_uploads`
4. Set signing mode to "Unsigned" for client-side uploads
5. Configure folder and transformations as needed

## 3. EmailJS Setup

### Create EmailJS Account
1. Go to [EmailJS](https://www.emailjs.com)
2. Sign up for a free account
3. Verify your email address

### Create Email Service
1. Go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions
5. Copy the Service ID

### Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Create a template for enquiry notifications
4. Use variables like `{{name}}`, `{{email}}`, `{{message}}`
5. Copy the Template ID

### Get Public Key
1. Go to "Account" > "General"
2. Copy your Public Key

## 4. Environment Variables Setup

Create a `.env.local` file in your project root:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/influeconnect?retryWrites=true&w=majority

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# Email
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
ADMIN_EMAIL=admin@influeconnect.com
```

## 5. Install Dependencies and Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## 6. Seed Database (Optional)

Create sample data for testing:

```bash
# Create seed script
node scripts/seed.js
```

## 7. Deployment on Vercel

### Deploy to Vercel
1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Add all environment variables in Vercel dashboard
5. Deploy

### Configure Environment Variables in Vercel
1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add all the variables from your `.env.local` file
4. Redeploy your application

## 8. Testing the Setup

### Test MongoDB Connection
- Visit `/api/influencers` - should return empty array
- Try registering an influencer - should save to database

### Test Cloudinary Upload
- Go to `/register` page
- Try uploading an image - should upload to Cloudinary

### Test Email Notifications
- Submit an enquiry form
- Check if admin receives email notification

## Troubleshooting

### MongoDB Issues
- Check if IP address is whitelisted
- Verify username/password in connection string
- Ensure database user has proper permissions

### Cloudinary Issues
- Verify API credentials are correct
- Check upload preset configuration
- Ensure CORS is configured for your domain

### Email Issues
- Verify EmailJS service is properly configured
- Check template variables match your form data
- Ensure public key is correct

## Production Considerations

### Security
- Use environment-specific MongoDB clusters
- Restrict MongoDB IP access to your server IPs
- Use signed uploads for Cloudinary in production
- Implement rate limiting for API endpoints

### Performance
- Add database indexes for search queries
- Use Cloudinary transformations for optimized images
- Implement caching for frequently accessed data
- Consider using CDN for static assets

### Monitoring
- Set up error tracking (Sentry)
- Monitor database performance
- Track API usage and limits
- Set up uptime monitoring

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Test each service independently
4. Check the documentation for each service
5. Contact support if needed

## Next Steps

1. Customize the design and branding
2. Add more influencer categories
3. Implement advanced search filters
4. Add payment integration
5. Set up analytics tracking
6. Create admin dashboard
7. Add automated testing
8. Implement CI/CD pipeline