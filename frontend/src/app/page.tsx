import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black px-4 sm:px-6">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-16 sm:py-24 lg:py-32 px-6 sm:px-8 lg:px-16 bg-white dark:bg-black rounded-lg mx-4">
        <div className="flex flex-col items-center gap-4 sm:gap-6 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight text-black dark:text-zinc-50">
            BlinkForm
          </h1>
          <p className="max-w-md text-base sm:text-lg leading-7 sm:leading-8 text-zinc-600 dark:text-zinc-400 px-4">
            Create no-code Solana Blinks with visual flow builder.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium mt-6 sm:mt-8">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black px-6 text-white transition-colors hover:bg-gray-800 active:bg-gray-900 touch-manipulation md:w-[200px] text-sm sm:text-base"
            href="/builder"
          >
            Open Builder
          </a>
        </div>

        {/* Mobile preview hint */}
        <div className="mt-8 sm:mt-12 text-center">
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Fully responsive • Touch-friendly • Mobile optimized
          </p>
        </div>
      </main>
    </div>
  );
}
