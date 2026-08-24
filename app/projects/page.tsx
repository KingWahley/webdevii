import SmoothScroll from "@/components/SmoothScroll";
import Projects from "@/components/Projects";
import { getProjects } from "@/app/actions/projects";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects Showcase",
  description: "Curated collection of live web applications and projects.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <SmoothScroll>
      <main className="max-w-5xl mx-auto px-6 py-16 sm:py-24 space-y-16">
        <Projects projects={projects} showAllDefault={true} />
      </main>
    </SmoothScroll>
  );
}
