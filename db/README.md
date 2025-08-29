# CamIt Database Schema

## Overview
This directory contains the complete database schema for the CamIt photo and video editing marketplace platform. All database tables, indexes, triggers, and sample data are consolidated into a single `schema.sql` file for easy management and deployment.

## File Structure
```
db/
├── schema.sql    # Complete database schema with all tables and sample data
└── README.md     # This documentation file
```

## Database Schema

### Core Tables

#### Users
- **Purpose**: Unified user management for clients, photographers, and editors
- **Key Fields**: `id`, `email`, `password_hash`, `full_name`, `user_type`, `is_verified`
- **User Types**: `client`, `photographer`, `editor`

#### User Sessions
- **Purpose**: Session management for user authentication
- **Key Fields**: `user_id`, `session_token`, `expires_at`

### Photographer Tables

#### Photographer Profiles
- **Purpose**: Detailed profiles for photographers
- **Key Fields**: `user_id`, `bio`, `equipment`, `hourly_rate`, `specialties`, `portfolio`
- **Features**: Awards, celebrity clients, availability tracking

### Editor Tables

#### Editor Profiles
- **Purpose**: Detailed profiles for photo/video editors
- **Key Fields**: `user_id`, `bio`, `specialties`, `software_skills`, `full_service_rate`
- **Features**: Social media handles, awards, earnings tracking, statistics

#### Editor Images
- **Purpose**: Portfolio and before/after image management
- **Key Fields**: `editor_id`, `image_url`, `title`, `image_type`
- **Image Types**: `portfolio`, `before_after`, `sample`

#### Editor Reviews
- **Purpose**: Review system for editors
- **Key Fields**: `editor_id`, `reviewer_id`, `rating`, `review_text`
- **Features**: Multi-criteria ratings (turnaround, communication, quality)

### Booking Tables

#### General Bookings
- **Purpose**: Photography booking management
- **Key Fields**: `client_id`, `photographer_id`, `service_type`, `event_type`, `status`

#### Editor Bookings
- **Purpose**: Photo/video editing project management
- **Key Fields**: `client_id`, `editor_id`, `service_type`, `project_title`, `deadline_date`
- **Features**: File upload tracking, urgency levels, payment status

### Review Tables

#### Reviews
- **Purpose**: General review system
- **Key Fields**: `booking_id`, `reviewer_id`, `reviewee_id`, `rating`, `comment`

### Communication Tables

#### Messages
- **Purpose**: In-app messaging system
- **Key Fields**: `booking_id`, `sender_id`, `recipient_id`, `message_text`

### Payment Tables

#### Payments
- **Purpose**: Payment processing and tracking
- **Key Fields**: `booking_id`, `payer_id`, `recipient_id`, `amount`, `payment_status`
- **Features**: Stripe integration, multiple payment methods

### Notification Tables

#### Notifications
- **Purpose**: User notification system
- **Key Fields**: `user_id`, `title`, `message`, `type`
- **Types**: `booking`, `payment`, `review`, `system`

## Key Features

### Row Level Security (RLS)
- **Editor Reviews**: Users can only manage their own reviews
- **Editor Bookings**: Clients can view their bookings, editors can view assigned bookings

### Performance Optimization
- **Indexes**: Comprehensive indexing on frequently queried fields
- **Triggers**: Automatic `updated_at` timestamp management

### Data Integrity
- **Foreign Keys**: Proper referential integrity
- **Check Constraints**: Data validation (ratings, status values, etc.)
- **Unique Constraints**: Email uniqueness, session token uniqueness

## Sample Data

The schema includes comprehensive sample data:
- **Users**: 7 sample users (photographers, editors, clients)
- **Editor Profiles**: 3 detailed editor profiles with social media
- **Editor Images**: Sample portfolio and before/after images
- **Editor Reviews**: Sample reviews with ratings and feedback

## Deployment

### Local Development
```sql
-- Run the complete schema
psql -d your_database_name -f db/schema.sql
```

### Production
```sql
-- For Supabase or other PostgreSQL providers
-- Copy and paste the contents of schema.sql into your SQL editor
```

## Migration History

This consolidated schema includes all previous migrations:
- ✅ User management system
- ✅ Photographer profiles
- ✅ Editor profiles with social media
- ✅ Editor reviews system
- ✅ Editor bookings system
- ✅ Editor images/portfolio
- ✅ Payment processing
- ✅ Messaging system
- ✅ Notification system
- ✅ Row Level Security
- ✅ Performance indexes
- ✅ Sample data

## Maintenance

### Adding New Tables
1. Add the table definition to `schema.sql`
2. Add appropriate indexes
3. Add triggers if needed
4. Update this README

### Modifying Existing Tables
1. Update the table definition in `schema.sql`
2. Add migration scripts if needed for existing databases
3. Update this README

## Security Considerations

- **Password Hashing**: All passwords are hashed using bcrypt
- **Row Level Security**: Sensitive data is protected by RLS policies
- **Session Management**: Secure session tokens with expiration
- **Input Validation**: Check constraints prevent invalid data

## Performance Considerations

- **Indexes**: Optimized for common query patterns
- **JSONB Fields**: Used for flexible data storage (awards, stats, etc.)
- **Array Fields**: Efficient storage for specialties, languages, etc.
- **Triggers**: Automatic timestamp management

---

**Note**: This schema is designed for PostgreSQL and includes Supabase-specific features like Row Level Security (RLS) policies.

