import { UploadOffering } from "@/components/upload-offering";

export default function Page() {
  return (
    <main className="min-h-dvh relative flex flex-col items-center">
      {/* Corner accents */}
      <img
        src="/images/top-left.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none fixed left-2 top-2 w-24 md:w-36 opacity-90"
      />
      <img
        src="/images/top-right.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none fixed right-2 top-2 w-24 md:w-36 opacity-90"
      />
      <img
        src="/images/bottom-left.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none fixed left-2 bottom-2 w-24 md:w-36 opacity-90"
      />
      <img
        src="/images/bottom-right.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none fixed right-2 bottom-2 w-24 md:w-36 opacity-90"
      />

      {/* Logo (fixed, on top) */}
      <img
        src="/images/logo.jpeg"
        alt="Ritual seal"
        className="fixed top-6 left-1/2 -translate-x-1/2 w-40 md:w-56 h-auto select-none pointer-events-none z-50"
      />

      {/* UploadOffering will render fixed button + a full-height scrollable list */}
      <UploadOffering />
    </main>
  );
}
