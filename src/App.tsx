import type { UseShooAuthResult } from "@shoojs/react";
import { useShooAuth } from "@shoojs/react";

type UserStatusProps = Pick<
  UseShooAuthResult,
  "identity" | "claims" | "loading" | "error"
>;

function UserStatus({ identity, claims, loading, error }: UserStatusProps) {
  const status = loading
    ? "Loading..."
    : identity.pairwiseSub
      ? "Signed in"
      : "Signed out";

  const token = identity.token;
  const tokenPreview = token
    ? `${token.slice(0, 22)}...${token.slice(-16)}`
    : "none";

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
        <code className="text-neutral-400">{tokenPreview}</code>
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

const btn =
  "cursor-pointer rounded-md border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-sm text-neutral-200 no-underline";

export default function App() {
  const auth = useShooAuth({
    shooBaseUrl: "https://shoo.dev",
    callbackPath: "/auth/callback",
  });

  return (
    <main className="mx-auto min-h-screen max-w-3xl bg-neutral-950 px-4 py-12 font-sans leading-relaxed text-neutral-200">
      <h1 className="mt-0 text-2xl font-medium tracking-tight">
        Shoo + Vite Example
      </h1>
      <p className="text-neutral-500">
        Client-only flow with fixed callback path{" "}
        <code className="text-neutral-400">/auth/callback</code> and return-to
        restore.
      </p>

      <div className="mb-5 flex flex-wrap gap-2.5">
        <a
          className={btn}
          href="https://shoo.dev/authorize"
          onClick={(e) => {
            e.preventDefault();
            void auth.signIn({ requestPii: false });
          }}
        >
          Sign In
        </a>
        <a
          className={btn}
          href="https://shoo.dev/authorize?pii=true"
          onClick={(e) => {
            e.preventDefault();
            void auth.signIn({ requestPii: true });
          }}
        >
          Sign In + PII
        </a>
        <button className={btn} type="button" onClick={auth.refreshIdentity}>
          Refresh Identity
        </button>
        <button className={btn} type="button" onClick={auth.clearIdentity}>
          Clear Identity
        </button>
      </div>

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
