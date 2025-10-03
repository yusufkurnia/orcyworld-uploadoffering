import { UploadOffering } from "@/components/upload-offering";

export default function Page() {
  return (
    // padding-top responsif: mobile pt-28, md:pt-36, lg:pt-44
    <main className="min-h-dvh relative flex flex-col items-center pt-44 md:pt-56 lg:pt-64">
      {/* Corner accents */}
      <img
        src="/images/top-left.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none fixed left-2 top-2 w-24 md:w-36 opacity-90 z-[9999]"
      />
      <img
        src="/images/top-right.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none fixed right-2 top-2 w-24 md:w-36 opacity-90 z-[9999]"
      />
      <img
        src="/images/bottom-left.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none fixed left-2 bottom-2 w-24 md:w-36 opacity-90 z-[9999]"
      />
      <img
        src="/images/bottom-right.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none fixed right-2 bottom-2 w-24 md:w-36 opacity-90 z-[9999]"
      />

      {/* Logo */}
      <img
        src="/images/logo.jpeg"
        alt="Ritual seal"
        className="fixed top-6 left-1/2 -translate-x-1/2 w-40 md:w-56 h-auto select-none pointer-events-none z-[10000]"
      />

      {/* Main widget */}
      <UploadOffering />
    </main>
  );
}
