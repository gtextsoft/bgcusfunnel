# Business Growth Conference CMS

A comprehensive Content Management System for managing your Business Growth Conference 2025 funnel landing page.

## Features

### 🎯 Complete Funnel Management
- **Landing Page**: Pixel-perfect recreation of your Business Growth Conference design
- **Event Details**: Manage conference information, dates, and location
- **Pricing Tiers**: Dynamic pricing management with General ($199) and VIP ($999) options
- **Testimonials**: Customer reviews and social proof management
- **Coaches**: Speaker profiles and biographies
- **Features**: Value proposition sections
- **Settings**: Global configuration options

### 📊 Admin Dashboard
- **Dashboard**: Overview with statistics and quick actions
- **Real-time Updates**: Live countdown timer and seat availability
- **Image Management**: File upload and preview functionality
- **Mobile Responsive**: Works on all devices

### 🛠 Technical Features
- **Database**: SQLite for easy setup and portability
- **API**: RESTful endpoints for all content management
- **File Uploads**: Image handling with UUID naming
- **Real-time Preview**: See changes as you make them
- **Professional UI**: Clean, modern admin interface

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```

3. **Access the CMS**
   - Landing Page: http://localhost:3000
   - Admin Dashboard: http://localhost:3000/admin

## Usage

### Admin Panel Navigation

#### 📊 Dashboard
- Overview of all content
- Quick statistics
- Recent activity

#### 📅 Event Details
- Event title and subtitle
- Date and location
- Event description
- Hero image upload
- Real-time preview

#### 💰 Pricing Management
- Add/edit/delete pricing tiers
- Feature lists
- Button customization
- Featured tier highlighting
- Live pricing preview

#### ⭐ Testimonials
- Customer reviews
- Star ratings
- Profile images
- Company information
- Active/inactive status

#### 👥 Coaches
- Speaker profiles
- Professional biographies
- Profile images
- Social media links
- Sort order management

#### 🎯 Features
- Value proposition features
- Icons and descriptions
- Active/inactive status
- Custom ordering

#### ⚙️ Settings
- VIP seat availability
- Countdown timer
- Trust indicators
- SEO meta tags
- Contact information

## API Endpoints

### Event Details
- `GET /api/event` - Get event details
- `POST /api/event` - Update event details

### Pricing
- `GET /api/pricing` - Get all pricing tiers
- `POST /api/pricing` - Create new pricing tier
- `PUT /api/pricing/:id` - Update pricing tier
- `DELETE /api/pricing/:id` - Delete pricing tier

### Testimonials
- `GET /api/testimonials` - Get all testimonials
- `POST /api/testimonials` - Create new testimonial
- `PUT /api/testimonials/:id` - Update testimonial
- `DELETE /api/testimonials/:id` - Delete testimonial

### Coaches
- `GET /api/coaches` - Get all coaches
- `POST /api/coaches` - Create new coach
- `PUT /api/coaches/:id` - Update coach
- `DELETE /api/coaches/:id` - Delete coach

### Features
- `GET /api/features` - Get all features
- `POST /api/features` - Create new feature
- `PUT /api/features/:id` - Update feature
- `DELETE /api/features/:id` - Delete feature

### Settings
- `GET /api/settings` - Get all settings
- `PUT /api/settings/:key` - Update setting

### File Upload
- `POST /api/upload` - Upload image file

### Data Export
- `GET /api/all-data` - Get all CMS data (for frontend)

## File Structure

```
business-growth-conference-cms/
├── server.js              # Main server file
├── package.json           # Dependencies
├── README.md             # This file
├── index.html            # Landing page
├── cms.db                # SQLite database (auto-created)
├── uploads/              # Uploaded images (auto-created)
├── views/                # EJS templates
│   └── admin/
│       ├── dashboard.ejs
│       ├── event.ejs
│       ├── pricing.ejs
│       ├── testimonials.ejs
│       ├── coaches.ejs
│       ├── features.ejs
│       └── settings.ejs
└── public/               # Static assets (auto-created)
```

## Database Schema

### event_details
- Event information, dates, and descriptions

### pricing_tiers
- Pricing plans with features and pricing

### testimonials
- Customer reviews and ratings

### coaches
- Speaker profiles and information

### features
- Value proposition features

### settings
- Global configuration options

## Customization

### Styling
- All admin pages use inline CSS for easy customization
- Landing page styles are embedded in `index.html`
- Color scheme based on #4F46E5 (primary) and #FF1744 (accent)

### Adding New Content Types
1. Create database table in `server.js`
2. Add API endpoints
3. Create admin page in `views/admin/`
4. Add navigation link

### Database Backup
The SQLite database (`cms.db`) can be easily backed up by copying the file.

## Development

### Development Mode
```bash
npm run dev
```

### Production Deployment
1. Install dependencies
2. Set NODE_ENV=production
3. Start with process manager (PM2 recommended)

## Security Considerations

### For Production Use:
- Add authentication/authorization
- Implement rate limiting
- Add CSRF protection
- Use environment variables for sensitive data
- Set up HTTPS
- Add input validation and sanitization

## Support

For issues or questions:
- Check the admin dashboard for system status
- Review API endpoints documentation
- Check database connectivity

## License

This CMS is created for the Business Growth Conference 2025 project.

## Version History

- **v1.0** - Initial release with full CMS functionality
  - Complete admin dashboard
  - All content management features
  - RESTful API
  - File upload system
  - Mobile responsive design