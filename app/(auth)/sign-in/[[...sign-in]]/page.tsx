"use client";

import { useSignIn } from "@clerk/nextjs";

export default function SignInPage() {
  const { isLoaded, signIn } = useSignIn();

const signInWithGoogle = async () => {
  if (!isLoaded || !signIn) return;

  try {
    console.log("Starting Google OAuth");

    await signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      oidcPrompt: "select_account",
      redirectUrl: "/sign-in/sso-callback",
      redirectUrlComplete: "/onboarding",
    });
  } catch (err) {
    console.error("Google OAuth error:", err);
  }
};

console.log("signIn methods:", {
  authenticateWithRedirect: typeof signIn?.authenticateWithRedirect,
  sso: typeof (signIn as any)?.sso,
});


  console.log("signIn methods:", {
  authenticateWithRedirect: typeof signIn?.authenticateWithRedirect,
  sso: typeof (signIn as any)?.sso,
});

  const signInWithGitHub = async () => {
    if (!isLoaded || !signIn) {
      return;
    }

    await signIn.authenticateWithRedirect({
      strategy: "oauth_github",
      redirectUrl: "/sign-in/sso-callback",
      redirectUrlComplete: "/",
    });
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-[400px] overflow-hidden rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="px-10 pt-8 text-center">
          <h1 className="text-xl font-bold text-gray-900">
            Sign in to Threads
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Welcome back! Please sign in to continue
          </p>  
        </div>

        {/* OAuth buttons */}
        <div className="px-10 pt-6 space-y-2">
          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={!isLoaded}
            className="h-10 w-full rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Continue with Google
          </button>

          <button
            type="button"
            onClick={signInWithGitHub}
            disabled={!isLoaded}
            className="h-10 w-full rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Continue with GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 px-10 py-6">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-sm text-gray-500">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Email */}
        <div className="px-10 pb-8">
          <label
            htmlFor="identifier"
            className="block text-sm font-medium text-gray-800"
          >
            Email address or username
          </label>

          <input
            id="identifier"
            type="text"
            placeholder="Enter email or username"
            className="mt-2 h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-gray-500"
          />

          <button
            type="button"
            disabled={!isLoaded}
            className="mt-7 h-10 w-full rounded-md bg-gray-800 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-50"
          >
            Continue
            <span className="ml-2">▸</span>
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-10 py-4 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <a
            href="/sign-up"
            className="font-medium text-gray-700 hover:underline"
          >
            Sign up
          </a>
        </div>

        <div className="border-t border-gray-100 bg-gray-50 px-10 py-4 text-center">
          <p className="text-xs text-gray-500">
            Secured by <span className="font-semibold">clerk</span>
          </p>
        </div>
      </div>
    </main>
  );
}
