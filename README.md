# SkillMapper AI

A comprehensive skill analysis and career planning platform that leverages AI to provide insights into skill demand, salary benchmarks, and personalized career paths.

## Features

- **Skills Heatmap**: Visualize real-time demand for skills across different cities and industries
- **Skill Shortage Engine**: Identify critical skill shortages and oversupply to make strategic career moves
- **AI Career Planner**: Get personalized career route recommendations based on your unique profile
- **Migration Assistant**: Analyze opportunities for career moves between cities
- **Policy Advisor**: Get AI-powered recommendations for workforce development policies
- **Skill Graph Intelligence**: Visualize relationships between skills and career paths

## Tech Stack

- Next.js 14 (App Router)
- React
- TypeScript
- Tailwind CSS
- Radix UI
- Genkit with Google AI
- Firebase
- Recharts

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env.local
```

3. Add your API keys to `.env.local`:
```env
GOOGLE_GENAI_API_KEY=your_google_genai_api_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

To access the application from other devices on the same network:
```bash
npm run dev:host
```

The application will be available at `http://YOUR_IP_ADDRESS:3000`. Find your IP address using:
```bash
# On macOS/Linux
ifconfig | grep -E "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}'

# On Windows
ipconfig | findstr "IPv4"
```

## Firebase Integration

This project is configured for Firebase Hosting. To deploy:

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init hosting
```

4. Build the project:
```bash
npm run build
```

5. Deploy to Firebase:
```bash
firebase deploy
```

## Environment Variables

The application uses the following environment variables:

- `GOOGLE_GENAI_API_KEY`: API key for Google's GenAI service
- `NEXT_PUBLIC_FIREBASE_API_KEY`: Firebase API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Firebase auth domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Firebase project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Firebase storage bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Firebase messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID`: Firebase app ID

## Project Structure

```
.
├── ai/                     # AI flows and logic
│   ├── flows/              # Individual AI flows
│   ├── dev.ts              # Development server setup
│   └── genkit.ts           # Genkit configuration
├── app/                    # Next.js app router pages
│   ├── (app)/              # Main application routes
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # Reusable UI components
├── hooks/                  # Custom React hooks
└── lib/                    # Utilities and data
    ├── data.ts             # Static data
    ├── types.ts            # TypeScript types
    └── firebase.ts         # Firebase configuration
```

## AI Flows

The application includes several AI-powered features:

- `extract-skills-from-job-description`: Extract relevant skills from job descriptions
- `skill-migration-assistant`: Provide migration recommendations
- `recommend-career-route`: Suggest career paths
- `detect-skill-anomalies`: Identify unusual skill patterns
- `migration-simulator`: Simulate migration scenarios
- `policy-advisor`: Provide policy recommendations
- `skill-graph-intelligence`: Analyze skill relationships