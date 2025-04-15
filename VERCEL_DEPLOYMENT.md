# Vercel Deployment Guide for Book2Latt

## Changes Made

1. **Database Migration**
   - Migrated from Cloudflare D1 to Prisma with PostgreSQL support
   - Created Prisma schema matching the original database structure
   - Refactored all service files to use Prisma client

2. **Environment Variables**
   - Replaced Cloudflare-specific environment variables
   - Added proper environment variable handling for Vercel deployment
   - Created centralized environment configuration

3. **Configuration Updates**
   - Maintained Next.js configuration for Vercel compatibility
   - Updated middleware implementation
   - Removed Cloudflare-specific configuration (wrangler.toml)

## Deployment Instructions

### Prerequisites

1. Create a PostgreSQL database (options include):
   - Vercel Postgres
   - Supabase
   - Railway
   - Neon
   - Any other PostgreSQL provider

2. Set up the following environment variables in Vercel:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NODE_ENV`: Set to "production" for production deployments

### Deployment Steps

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. In Vercel dashboard:
   - Create a new project
   - Import your repository
   - Configure the environment variables
   - Deploy the project

3. After initial deployment:
   - Run database migrations using Prisma
   - Vercel CLI: `vercel env pull && npx prisma db push`
   - Or set up a deployment hook to run migrations

## Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Set up local environment variables:
   - Create a `.env` file with:
     ```
     DATABASE_URL="postgresql://postgres:postgres@localhost:5432/book2latt"
     ```

3. Set up local database:
   ```
   npx prisma db push
   ```

4. Run the development server:
   ```
   npm run dev
   ```

## Database Schema

The Prisma schema includes the following models:
- User
- ProductCategory
- Product
- ProductSpecification
- Order
- OrderItem

This matches the original database structure while providing compatibility with Vercel deployment.

## Additional Notes

- The application now uses Prisma's connection pooling, which is more efficient for serverless environments
- Authentication still uses cookie-based sessions as in the original implementation
- All features from the original application are preserved
