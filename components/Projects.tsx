"use client";

import { useState } from "react";
import Image from "next/image";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProjectItem } from "@/lib/types/database.types";

interface ProjectsProps {
  projects?: ProjectItem[];
}

const defaultProjects: ProjectItem[] = [
  {
    id: "leisure-sports-atv",
    title: "Nautica beach ATV",
    url: "https://leisuresportsatv.com",
    domain: "leisuresportsatv.com",
    image_url: "/beach_atv_thumbnail.png",
    initially_hidden: false,
    sort_order: 1,
  },
  {
    id: "leisure-sports-paintball",
    title: "Nautica beach soccer and paintball",
    url: "https://Nautica.leisuresportspaintball.com",
    domain: "Nautica.leisuresportspaintball.com",
    image_url: "/beach_soccer_thumbnail.png",
    initially_hidden: false,
    sort_order: 2,
  },
  {
    id: "leisure-sports-nike-lake",
    title: "Leisure sports Nike Lake",
    url: "https://Nike-Lake.leisuresportsatv.com",
    domain: "Nike-Lake.leisuresportsatv.com",
    image_url: "/nike_lake_thumbnail.png",
    initially_hidden: false,
    sort_order: 3,
  },
  {
    id: "play-padel-ikoyi",
    title: "Play Padel ikoyi",
    url: "https://ikoyi.playpadelltd.com",
    domain: "ikoyi.playpadelltd.com",
    image_url: "/play_padel_thumbnail.png",
    initially_hidden: true,
    sort_order: 4,
  },
  {
    id: "labs-pest-control",
    title: "Labs Pest Control",
    url: "https://www.labspestcontrol.com/",
    domain: "labspestcontrol.com",
    image_url: "/pest_control_thumbnail.png",
    initially_hidden: true,
    sort_order: 5,
  },
  {
    id: "kinknot",
    title: "Kinknot",
    url: "https://www.kinknot.com/",
    domain: "kinknot.com",
    image_url: "/kinknot_thumbnail.png",
    initially_hidden: true,
    sort_order: 6,
  },
];

export default function Projects({ projects: initialProjects }: ProjectsProps) {
  const [showAll, setShowAll] = useState(false);

  const rawList =
    initialProjects && initialProjects.length > 0
      ? initialProjects
      : defaultProjects;

  const projectList = [...rawList].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );

  const INITIAL_DISPLAY_COUNT = 5;
  const hasMore = projectList.length > INITIAL_DISPLAY_COUNT;

  const handleViewMore = () => {
    setShowAll(true);
    setTimeout(() => {
      if (typeof window !== "undefined") {
        ScrollTrigger.refresh();
      }
    }, 100);
  };

  const visibleProjects = showAll
    ? projectList
    : projectList.slice(0, INITIAL_DISPLAY_COUNT);

  return (
    <section id="projects" className="space-y-12">
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white uppercase font-display leading-[0.95] sm:leading-[0.85] mb-12 sm:mb-16">
        Recent
        <br />
        <span className="text-[#2C2C2C]">Projects</span>
      </h2>

      <div className="space-y-4">
        {visibleProjects.map((project, index) => (
          <a
            key={project.id}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group border-b border-[#262626] ${
              index === 0 ? "pb-8" : "py-8"
            } flex items-center justify-between hover:border-neutral-700 transition-colors duration-300 project-card block cursor-pointer`}
          >
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#161616] border border-neutral-800 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 relative">
                <Image
                  src={project.image_url}
                  alt={project.title}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-white group-hover:text-[#FF6B35] transition-colors duration-300 font-display">
                  {project.title}
                </h4>
                <p className="text-sm text-neutral-500 mt-1 font-medium font-sans">
                  {project.domain}
                </p>
              </div>
            </div>

            <div className="w-12 h-12 rounded-2xl border border-[#262626] flex items-center justify-center text-neutral-500 group-hover:text-[#FF6B35] group-hover:border-[#FF6B35] group-hover:rotate-45 transition duration-300">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </div>
          </a>
        ))}
      </div>

      {/* View More Projects Button */}
      {!showAll && hasMore && (
        <div className="flex justify-center mt-12" id="view-more-container">
          <button
            id="view-more-projects"
            onClick={handleViewMore}
            type="button"
            className="px-8 py-3.5 border border-[#262626] rounded-full hover:border-[#FF6B35] hover:text-[#FF6B35] text-neutral-400 font-bold transition duration-300 uppercase tracking-wider text-xs pointer-events-auto cursor-pointer"
          >
            View More Projects
          </button>
        </div>
      )}
    </section>
  );
}
