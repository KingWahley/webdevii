import Image from "next/image";
import type { Profile } from "@/lib/types/database.types";

interface HeroProps {
  profile?: Profile;
}

export default function Hero({ profile }: HeroProps) {
  const name = profile?.name || "Peter Olawale";
  const title = profile?.title || "Software Engineer";
  const shortBio =
    profile?.bio ||
    "I help businesses build websites that serve as powerful sales machines. Clean design, fast performance, and strategic structure.";
  const fullIntro =
    profile?.full_intro ||
    "I’m Peter, a developer and designer focused on creating clean, modern, and engaging digital experiences. I help businesses transform their ideas into responsive websites and applications through thoughtful design and powerful technology. When I'm not working, I stay curious through tech blogs, play football and unwind with video games.";
  const avatarUrl = profile?.avatar_url || "/profile_portrait.png";
  const experienceYears = profile?.experience_years || "+12";
  const projectsCount = profile?.projects_count || "+46";
  const clientsCount = profile?.clients_count || "+20";
  const instagramUrl =
    profile?.instagram_url ||
    "https://www.instagram.com/webdevii?igsh=MXh5c2FxYTZpc3R0aQ%3D%3D&utm_source=qr";
  const githubUrl = profile?.github_url || "https://github.com/KingWahley";
  const linkedinUrl =
    profile?.linkedin_url || "https://www.linkedin.com/in/olawale-peter-5898a9249/";
  const email = profile?.email || "kingwahley@gmail.com";

  return (
    <header className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch lg:h-[60vh] lg:min-h-[580px]">
      {/* Left Profile Card */}
      <div className="lg:col-span-1 bg-white text-neutral-950 rounded-[2.5rem] p-6 flex flex-col justify-between border border-neutral-200 shadow-sm relative group overflow-hidden h-full hero-element">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Portrait Image Frame */}
          <div className="relative overflow-hidden rounded-[2rem] h-[280px] sm:h-[320px] lg:h-auto lg:flex-1 lg:min-h-[180px] mb-4 bg-neutral-100 shadow-inner">
            <Image
              src={avatarUrl}
              alt={name}
              fill
              priority
              className="w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-700 ease-out scale-105 group-hover:scale-100"
            />
          </div>

          {/* Name */}
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-950 font-display leading-tight mb-0.5">
            {name}
          </h1>

          {/* Title on mobile: Software Engineer */}
          <p className="text-xs uppercase tracking-wider font-extrabold text-[#FF6B35] font-display mb-2.5 lg:hidden">
            {title}
          </p>

          {/* Full Intro text on mobile */}
          <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed font-medium lg:hidden">
            {fullIntro}
          </p>

          {/* Short card bio (Desktop only) */}
          <p className="text-neutral-500 text-xs leading-relaxed font-medium hidden lg:block">
            {shortBio}
          </p>
        </div>

        {/* Graphic Path Element & Socials */}
        <div className="mt-4">
          {/* Custom SVG loops path */}
          <svg
            className="w-full h-12 my-4 text-[#FF6B35]"
            viewBox="0 0 200 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 20C40 20 40 5 70 5C100 5 100 35 130 35C160 35 160 20 190 20"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            {/* paper plane icon at the start */}
            <path
              d="M6 16.5L16 20L6 23.5L8.5 20L6 16.5Z"
              fill="currentColor"
            />
            {/* small circle at the end */}
            <circle cx="190" cy="20" r="3" fill="currentColor" />
          </svg>

          <div className="flex justify-between items-center gap-3 mt-4">
            {/* Instagram */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-700 hover:text-white hover:bg-[#FF6B35] hover:border-[#FF6B35] transition-all duration-300"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            {/* GitHub */}
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-700 hover:text-white hover:bg-[#FF6B35] hover:border-[#FF6B35] transition-all duration-300"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-700 hover:text-white hover:bg-[#FF6B35] hover:border-[#FF6B35] transition-all duration-300"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            {/* Email */}
            <a
              href={`mailto:${email}`}
              className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-700 hover:text-white hover:bg-[#FF6B35] hover:border-[#FF6B35] transition-all duration-300"
              aria-label="Email"
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
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Right Content Grid */}
      <div className="lg:col-span-2 flex flex-col justify-between lg:h-full gap-6">
        {/* Titles & Paragraph (Desktop only) */}
        <div className="space-y-4 hidden lg:block">
          <h2 className="text-7xl md:text-8xl font-extrabold tracking-tight text-white uppercase leading-[0.85] font-display hero-element">
            {title.includes(" ") ? (
              <>
                {title.split(" ")[0]}
                <br />
                <span className="text-[#2C2C2C]">{title.split(" ").slice(1).join(" ")}</span>
              </>
            ) : (
              title
            )}
          </h2>
          <p className="text-neutral-400 text-lg sm:text-xl font-normal leading-relaxed max-w-2xl hero-element">
            {fullIntro}
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-6 border-y border-[#262626] py-4 lg:py-3 hero-element">
          <div className="space-y-1">
            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight font-display">
              {experienceYears}
            </div>
            <div className="text-[10px] sm:text-xs uppercase text-neutral-500 font-bold tracking-wider leading-snug">
              Years of
              <br />
              experience
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight font-display">
              {projectsCount}
            </div>
            <div className="text-[10px] sm:text-xs uppercase text-neutral-500 font-bold tracking-wider leading-snug">
              Projects
              <br />
              completed
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight font-display">
              {clientsCount}
            </div>
            <div className="text-[10px] sm:text-xs uppercase text-neutral-500 font-bold tracking-wider leading-snug">
              Happy
              <br />
              clients
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
