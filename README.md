# STEP Student Mobile App

A React Native mobile application for students to access the STEP Education Center platform.

## Features

- 🔐 **Secure Authentication** - JWT-based login with encrypted token storage
- 📊 **Dashboard** - Quick overview of courses, attendance, and grades
- 📚 **Course Management** - View enrolled courses and materials
- 💰 **KHQR Payments** - Pay invoices using Bakong QR codes
- 📝 **Assignments** - Submit and track assignments
- 📈 **Grades** - View academic performance

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Navigation**: React Navigation
- **State**: React Context API
- **API**: Axios with JWT interceptors
- **Storage**: Expo SecureStore

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Expo Go app on your mobile device (iOS/Android)
- Backend server running on `http://localhost:5001`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Scan the QR code with Expo Go app

### Running on Specific Platforms

```bash
# Android
npm run android

# iOS
npm run ios

# Web (for testing)
npm run web
```

## Project Structure

```
StudentMobileApp/
├── src/
│   ├── context/          # React Context providers
│   │   └── AuthContext.tsx
│   ├── lib/              # Utilities and API client
│   │   └── apiClient.ts
│   ├── screens/          # App screens
│   │   ├── LoginScreen.tsx
│   │   └── DashboardScreen.tsx
│   └── components/       # Reusable components (to be added)
├── App.tsx               # Main app entry
├── app.json              # Expo configuration
├── package.json
└── tailwind.config.js
```

## API Integration

The app connects to the existing School Management System backend:

- **Base URL**: `http://localhost:5001/api`
- **Authentication**: JWT tokens stored in SecureStore
- **Endpoints Used**:
  - `POST /auth/login` - User authentication
  - `GET /financial/invoices` - Student invoices
  - `POST /financial/bakong-qr` - Generate KHQR codes
  - More endpoints to be integrated...

## Development Roadmap

### Phase 1: ✅ Infrastructure & Authentication
- [x] Project setup
- [x] API client with JWT
- [x] Authentication context
- [x] Login screen
- [x] Basic dashboard

### Phase 2: 🚧 Core Features (In Progress)
- [ ] Courses list screen
- [ ] Course details screen
- [ ] Assignments screen
- [ ] Grades/Transcript screen

### Phase 3: 📋 Financial Module
- [ ] Invoice list screen
- [ ] Bakong KHQR payment modal
- [ ] Payment history
- [ ] Real-time payment verification

### Phase 4: 🔔 Notifications & Polish
- [ ] Push notifications
- [ ] Profile management
- [ ] Offline support
- [ ] App icons and splash screen

## Notes

- For local development, ensure your mobile device and computer are on the same network
- Update `API_BASE_URL` in `src/lib/apiClient.ts` to your computer's local IP when testing on physical devices
- The app currently uses the same backend as the web application

## License

© 2026 STEP Education Center
