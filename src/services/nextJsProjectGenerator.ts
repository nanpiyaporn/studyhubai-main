export const NEXTJS_EXPORT_FILES = {
  envExample: `# ========================================================
# StudyHub AI - Secure Production Environment Variables
# Copy this to .env.local for local development.
# NEVER commit .env.local to GitHub!
# ========================================================

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-strong-32-byte-hex-secret-here"

# Google Cloud OAuth 2.0 Credentials (from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-oauth-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your-google-client-secret"

# Google Gemini AI API Key (via Google AI Studio or Vertex AI)
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"

# Production Deployment URL
APP_URL="https://studyhub.ai.studio"
`,

  gitignore: `# Dependency directories
/node_modules
/.pnp
.pnp.js

# Production build outputs
/.next/
/out/
/dist/
/build

# Sensitive Environment Variables (Strictly Protected)
.env
.env*.local
.env.production

# Debug logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# OS Files
.DS_Store
*.pem
`,

  nextAuthRoute: `// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/calendar.events",
            "https://www.googleapis.com/auth/tasks",
            "https://www.googleapis.com/auth/gmail.compose",
          ].join(" "),
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
`,

  agentRoute: `// app/api/agent/run-pipeline/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  // 1. Mandatory Authentication Check
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized: Google login required." }, { status: 401 });
  }

  const { syllabusText, courseCode, courseName } = await req.json();

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "GEMINI_API_KEY is not configured on server" }, { status: 500 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Call Gemini 3.7 Flash for autonomous taskmaster breakdown
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: \`Analyze this syllabus and construct a Spaced-Repetition Study Schedule, Google Tasks checklist, and diagnostic quiz: \${syllabusText}\`,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return NextResponse.json({ success: true, data: parsed });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`,

  middleware: `// middleware.ts
export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/workflows/:path*",
    "/calendar/:path*",
    "/tasks/:path*",
    "/api/agent/:path*",
  ],
};
`,
};
