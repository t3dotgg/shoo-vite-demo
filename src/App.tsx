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
    <div className="space-y-4">
      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        <span className="text-neutral-500">Status</span>
        <span className={identity.pairwiseSub ? "text-emerald-400" : "text-neutral-300"}>
          {status}
        </span>

        <span className="text-neutral-500">Subject</span>
        <code className="truncate font-mono text-neutral-400">
          {identity.pairwiseSub || "—"}
        </code>

        <span className="text-neutral-500">Token</span>
        <code className="truncate font-mono text-neutral-400">
          {tokenPreview}
        </code>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium tracking-wide text-neutral-500 uppercase">
          Decoded Claims
        </p>
        <pre className="overflow-auto rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 font-mono text-[13px] leading-relaxed text-neutral-400">
          {JSON.stringify(claims, null, 2) || "null"}
        </pre>
      </div>

      {error && (
        <p className="text-sm text-red-400">
          Error: <code className="font-mono">{error}</code>
        </p>
      )}
    </div>
  );
}

const btn =
  "cursor-pointer rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm text-neutral-300 no-underline transition-colors hover:bg-white/[0.08] hover:text-neutral-100";

export default function App() {
  const auth = useShooAuth({
    shooBaseUrl: "https://shoo.dev",
    callbackPath: "/auth/callback",
  });

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-16 font-sans text-neutral-200 antialiased">
      <header className="mb-10">
        <h1 className="mb-1 text-lg font-semibold tracking-tight text-neutral-100">
          Shoo + Vite
        </h1>
        <p className="text-sm text-neutral-500">
          Client-only auth flow &middot; callback at{" "}
          <code className="font-mono text-neutral-400">/auth/callback</code>
        </p>
      </header>

      <div className="mb-10 flex flex-wrap gap-2">
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
          Refresh
        </button>
        <button className={btn} type="button" onClick={auth.clearIdentity}>
          Clear
        </button>
      </div>

      <UserStatus
        identity={auth.identity}
        claims={auth.claims}
        loading={auth.loading}
        error={auth.error}
      />

      <footer className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-600">
        <span>Client-only demo. Verify tokens on your backend.</span>
        <span>&middot;</span>
        <a href="https://shoo.dev" className="text-neutral-500 hover:text-neutral-300 transition-colors" target="_blank" rel="noopener noreferrer">shoo.dev</a>
        <span>&middot;</span>
        <a href="https://github.com/t3dotgg/shoo-vite-demo" className="text-neutral-500 hover:text-neutral-300 transition-colors" target="_blank" rel="noopener noreferrer">GitHub</a>
      </footer>
    </main>
  );
}
