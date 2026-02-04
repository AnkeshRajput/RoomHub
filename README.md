# 🏠 RoomHub - Room Rental Platform

A modern, full-stack room rental platform built with Next.js where landlords can list their rooms and renters can search and discover rental properties nearby. With features like geolocation-based search, image galleries, and secure authentication.

**Made by Ankesh Rajput with ❤️**

---

## ✨ Features

- 🔐 **Secure Authentication** - Sign up and login with email/password (NextAuth + JWT)
- 👤 **User Roles** - Two user types: Landlord (list rooms) & Renter (search rooms)
- 📍 **Geolocation Search** - Find rooms near your location with customizable radius (1-5km)
- 📸 **Image Gallery** - Upload multiple images per room with Cloudinary integration
- 📱 **Fully Responsive Design** - Works perfectly on mobile, tablet, and desktop
- 🌙 **Dark Mode Support** - Tailwind CSS dark mode for better UX
- 📊 **Room Details** - View comprehensive information including address, rent, landlord contact
- 🔗 **Direct WhatsApp Contact** - Quick WhatsApp integration for landlord contact
- ✅ **Form Validation** - Client and server-side validation for data integrity
- 🎨 **Modern UI** - Clean and intuitive interface with smooth animations

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 16.1.6** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **NextAuth 4.24.13** - Authentication solution

### Backend

- **Next.js API Routes** - Serverless functions
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Cloudinary** - Image hosting and management

### Tools

- **ESLint** - Code linting
- **bcryptjs** - Password hashing
- **Lucide React** - Icon library

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18+) installed
- **npm** or **yarn** package manager
- **MongoDB Atlas** account (free tier available at [mongodb.com](https://www.mongodb.com/cloud/atlas))
- **Cloudinary** account (free tier available at [cloudinary.com](https://cloudinary.com))
- **Git** for version control

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd room-rental-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Connection (from MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dbname

# NextAuth Configuration
NEXTAUTH_SECRET=<generate-with: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000

# Cloudinary Configuration (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**How to get these credentials:**

- **MongoDB URI**:
  1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
  2. Create a free cluster
  3. Get connection string from "Connect" button

- **NEXTAUTH_SECRET**:

  ```bash
  openssl rand -base64 32
  ```

  (Run in terminal to generate a random secret)

- **Cloudinary**:
  1. Sign up at [cloudinary.com](https://cloudinary.com)
  2. Get your cloud name from dashboard
  3. Generate API key and secret from settings

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## 📁 Project Structure

```
room-rental-app/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/               # NextAuth configuration
│   │   ├── rooms/              # Room CRUD operations
│   │   └── upload/             # Image upload handler
│   ├── (protected)/            # Protected routes (require authentication)
│   │   ├── dashboard/          # User dashboard
│   │   ├── landlord/           # Landlord pages
│   │   └── renter/             # Renter pages
│   ├── components/             # Reusable React components
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout with footer
│   ├── page.tsx                # Home page
│   ├── login/                  # Login page
│   ├── signup/                 # Sign up page
│   └── about/                  # About page
├── lib/
│   ├── auth.ts                 # Authentication configuration
│   ├── db.ts                   # MongoDB connection
│   ├── cloudinary.ts           # Cloudinary setup
│   └── types.ts                # TypeScript type definitions
├── models/
│   ├── User.ts                 # User schema
│   └── Room.ts                 # Room schema
├── middleware.ts               # NextAuth middleware for protected routes
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.js          # Tailwind CSS config
└── next.config.ts              # Next.js config
```

---

## 🔑 Key Pages & Routes

### Public Pages

- `/` - Home page
- `/about` - About the platform
- `/login` - Login page
- `/signup` - Sign up / Registration

### Protected Pages (Requires Authentication)

- `/dashboard` - User dashboard
- `/landlord/add-room` - Add new room listing (Landlord only)
- `/landlord/my-rooms` - View posted rooms (Landlord only)
- `/renter/search` - Search for rooms (Renter only)

---

## 📝 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

---

## 🔐 Authentication Flow

1. **Sign Up**: User creates account with email, password, name, and role (landlord/renter)
2. **Login**: User authenticates with email and password
3. **JWT Token**: Session stored as JWT token (secure, stateless)
4. **Protected Routes**: Middleware checks authentication before allowing access
5. **Role-Based Access**: Different pages for landlords vs renters

---

## 📸 Image Upload Process

1. User selects image file
2. Image sent to Cloudinary via API route
3. Cloudinary stores image and returns URL
4. URL saved to MongoDB database
5. Frontend displays image in gallery

---

## 🌍 Deployment

### Deploy on Vercel (Recommended)

1. **Prepare your code**:

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Go to [vercel.com](https://vercel.com)**:
   - Click "New Project"
   - Import your GitHub repository
   - Select Next.js framework (auto-detected)

3. **Add Environment Variables**:
   - Go to "Settings" → "Environment Variables"
   - Add all variables from your `.env.local`:
     - `MONGODB_URI`
     - `NEXTAUTH_SECRET` (generate new for production)
     - `NEXTAUTH_URL=https://your-domain.vercel.app`
     - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
     - `CLOUDINARY_API_KEY`
     - `CLOUDINARY_API_SECRET`

4. **Click Deploy** - Vercel handles the rest!

### Deploy on Render or Railway

- Similar process to Vercel
- Add same environment variables
- Connect your GitHub repository

---

## 🐛 Common Issues & Solutions

### MongoDB Connection Error

- Verify `MONGODB_URI` is correct
- Check IP whitelist in MongoDB Atlas settings
- Ensure database name is correct

### Image Upload Not Working

- Verify Cloudinary credentials
- Check cloud name spelling
- Ensure API key and secret are correct

### Authentication Issues

- Generate new `NEXTAUTH_SECRET` using: `openssl rand -base64 32`
- Update `NEXTAUTH_URL` to match your domain
- Clear browser cookies and try again

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

---

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/signin` - Login user
- `GET /api/auth/logout` - Logout user

### Rooms

- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create new room (landlord)
- `PUT /api/rooms/:id` - Update room (landlord)
- `DELETE /api/rooms/:id` - Delete room (landlord)
- `POST /api/rooms/search` - Search by location

### Upload

- `POST /api/upload` - Upload image to Cloudinary

---

## 🤝 Contributing

Contributions are welcome! Please feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

**Ankesh Rajput**

- GitHub: [@ankeshrajput](https://github.com)
- Made with ❤️

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Cloudinary](https://cloudinary.com/) - Image hosting
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Common Issues](#-common-issues--solutions) section
2. Review [Next.js Documentation](https://nextjs.org/docs)
3. Check [MongoDB Documentation](https://docs.mongodb.com/)
4. Visit [Cloudinary Docs](https://cloudinary.com/documentation)

**Happy coding! 🚀**
