import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-dark text-neutral-100 min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-8xl font-black font-display text-white mb-4">404</h1>
      <h2 className="text-2xl font-bold font-display text-[#FF6B35] mb-4">
        Page Not Found
      </h2>
      <p className="text-neutral-400 max-w-md mb-8">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-8 py-3.5 bg-[#FF6B35] text-neutral-950 font-bold uppercase rounded-full text-xs tracking-wider hover:bg-[#e05a2b] transition duration-300"
      >
        Return Home
      </Link>
    </div>
  );
}
