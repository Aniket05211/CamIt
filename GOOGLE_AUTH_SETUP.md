# Google Authentication Setup

This guide will help you set up Google OAuth authentication for the CamIt application.

## Prerequisites

1. A Google Cloud Console account
2. A Google Cloud Project
3. OAuth 2.0 credentials

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google OAuth2 API

## Step 2: Create OAuth 2.0 Credentials

1. In the Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application" as the application type
4. Add the following authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback` (for development)
   - `https://yourdomain.com/api/auth/google/callback` (for production)
5. Note down your Client ID and Client Secret

## Step 3: Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 4: Database Migration

Run the following SQL commands to add Google auth fields to your database:

```sql
-- Add Google auth fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(20) DEFAULT 'email' CHECK (auth_provider IN ('email', 'google'));

-- Make password_hash nullable for Google auth users
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- Add index for google_id
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);

-- Add index for auth_provider
CREATE INDEX IF NOT EXISTS idx_users_auth_provider ON users(auth_provider);
```

## Step 5: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to `/login` or `/signup`
3. Click the "Continue with Google" button
4. Complete the Google OAuth flow
5. You should be redirected back to the application and logged in

## Features

- **Seamless Integration**: Google auth works alongside existing email/password authentication
- **User Creation**: New users are automatically created when they first sign in with Google
- **Account Linking**: Existing email users can link their Google account
- **Profile Sync**: Google profile information (name, email, picture) is automatically synced
- **Verified Status**: Google users are automatically marked as verified

## Security Notes

- Google Client Secret should never be exposed to the client-side
- All OAuth flows are handled server-side for security
- Session tokens are generated and managed securely
- User data is stored in your Supabase database

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**: Make sure your redirect URI exactly matches what's configured in Google Cloud Console
2. **"Client ID not found" error**: Verify your `NEXT_PUBLIC_GOOGLE_CLIENT_ID` environment variable is set correctly
3. **Database errors**: Ensure you've run the database migration script
4. **CORS errors**: Make sure your `NEXT_PUBLIC_APP_URL` is set correctly

### Debug Mode

To debug Google auth issues, check the browser console and server logs for detailed error messages.
