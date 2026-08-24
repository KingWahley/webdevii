"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isBlog = pathname?.startsWith("/blog");

  // Hide the floating public portfolio navbar on dashboard, login, and dedicated projects pages
  if (
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/login") ||
    pathname === "/projects"
  ) {
    return null;
  }

  return (
    <header className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">
      <nav className="flex items-center justify-around sm:justify-center w-[92%] sm:w-auto max-w-[420px] sm:max-w-none gap-2 sm:gap-3 px-6 sm:px-5 py-3 sm:py-2.5 bg-[#161616]/95 border border-[#262626]/90 rounded-full backdrop-blur-xl shadow-2xl pointer-events-auto transition-all duration-300">
        {/* Home Link */}
        <Link
          href="/#home"
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            pathname === "/" && !isBlog
              ? "text-white bg-neutral-900"
              : "text-neutral-400 hover:text-white hover:bg-neutral-900"
          }`}
          title="Home"
          aria-label="Home"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
        </Link>

        {/* Projects Link */}
        <Link
          href="/#projects"
          className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all duration-300"
          title="Projects"
          aria-label="Projects"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
            />
          </svg>
        </Link>

        {/* Tools Link */}
        <Link
          href="/#tools"
          className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all duration-300"
          title="Tools"
          aria-label="Tools"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
            />
          </svg>
        </Link>

        {/* Blog Link */}
        <Link
          href="/blog"
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            isBlog
              ? "text-[#FF6B35] bg-neutral-900 shadow-inner"
              : "text-neutral-400 hover:text-white hover:bg-neutral-900"
          }`}
          title="Blog"
          aria-label="Blog"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
            />
          </svg>
        </Link>

        {/* Contact Link */}
        <Link
          href="/#contact"
          className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all duration-300"
          title="Contact"
          aria-label="Contact"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </Link>
      </nav>
    </header>
  );
}
