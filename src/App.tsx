import type { MouseEvent } from "react";
import type { UseShooAuthResult } from "@shoojs/react";
import { useShooAuth } from "@shoojs/react";

const SHOO_BASE_URL = "https://shoo.dev";
const CALLBACK_PATH = "/auth/callback";

function getTokenPreview(token: string | undefined): string {
  if (!token) return "none";
  return `${token.slice(0, 22)}...${token.slice(-16)}`;
}

type SignInProps = Pick<
  UseShooAuthResult,
  "signIn" | "refreshIdentity" | "clearIdentity"
>;

type UserStatusProps = Pick<
  UseShooAuthResult,
  "identity" | "claims" | "loading" | "error"
>;

function onSignInLinkClick(
  event: MouseEvent<HTMLAnchorElement>,
  signIn: UseShooAuthResult["signIn"],
  requestPii: boolean,
): void {
  event.preventDefault();
  void signIn({ requestPii });
}

function SignIn({ signIn, refreshIdentity, clearIdentity }: SignInProps) {
  return (
    <div className="mb-5 flex flex-wrap gap-2.5">
      <a
        className="cursor-pointer rounded-md border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-sm text-neutral-200 no-underline"
        href={`${SHOO_BASE_URL}/authorize`}
        onClick={(event) => onSignInLinkClick(event, signIn, false)}
      >
        Sign In
      </a>
      <a
        className="cursor-pointer rounded-md border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-sm text-neutral-200 no-underline"
        href={`${SHOO_BASE_URL}/authorize?pii=true`}
        onClick={(event) => onSignInLinkClick(event, signIn, true)}
      >
        Sign In + PII
      </a>
      <button
        className="cursor-pointer rounded-md border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-sm text-neutral-200"
        type="button"
        onClick={refreshIdentity}
      >
        Refresh Identity
      </button>
      <button
        className="cursor-pointer rounded-md border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-sm text-neutral-200"
        type="button"
        onClick={clearIdentity}
      >
        Clear Identity
      </button>
    </div>
  );
}

function UserStatus({ identity, claims, loading, error }: UserStatusProps) {
  const status = loading
    ? "Loading..."
    : identity.pairwiseSub
      ? "Signed in"
      : "Signed out";

  return (
    <>
      <p>
        Status: <strong>{status}</strong>
      </p>
      <p>
        Pairwise subject:{" "}
        <code className="text-neutral-400">
          {identity.pairwiseSub || "none"}
        </code>
      </p>
      <p>
        Token preview:{" "}
        <code className="text-neutral-400">
          {getTokenPreview(identity.token)}
        </code>
      </p>

      <h3 className="font-medium">Decoded Profile (Unverified)</h3>
      <pre className="overflow-auto rounded-md border border-neutral-900 bg-neutral-950 p-3.5 text-[13px] leading-relaxed">
        {JSON.stringify(claims, null, 2) || "null"}
      </pre>

      {error ? (
        <p>
          Error: <code className="text-red-400">{error}</code>
        </p>
      ) : null}
    </>
  );
}

export default function App() {
  const auth = useShooAuth({
    shooBaseUrl: SHOO_BASE_URL,
    callbackPath: CALLBACK_PATH,
  });

  return (
    <main className="mx-auto min-h-screen max-w-3xl bg-neutral-950 px-4 py-12 font-sans leading-relaxed text-neutral-200">
      <h1 className="mt-0 text-2xl font-medium tracking-tight">
        Shoo + Vite Example
      </h1>
      <p className="text-neutral-500">
        Client-only flow with fixed callback path{" "}
        <code className="text-neutral-400">{CALLBACK_PATH}</code> and return-to
        restore.
      </p>

      <SignIn
        signIn={auth.signIn}
        refreshIdentity={auth.refreshIdentity}
        clearIdentity={auth.clearIdentity}
      />

      <p>
        Shoo base URL:{" "}
        <code className="text-neutral-400">{SHOO_BASE_URL}</code>
      </p>

      <UserStatus
        identity={auth.identity}
        claims={auth.claims}
        loading={auth.loading}
        error={auth.error}
      />

      <p className="mt-6 text-neutral-500">
        Note: this example is intentionally client-only. Verify Shoo tokens on
        your backend before trusting claims.
      </p>
    </main>
  );
}
