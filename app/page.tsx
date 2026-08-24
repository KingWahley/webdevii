import SmoothScroll from "@/components/SmoothScroll";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import ToolBox from "@/components/ToolBox";
import Thoughts from "@/components/Thoughts";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getProfile } from "@/app/actions/profile";
import { getProjects } from "@/app/actions/projects";
import { getBlogs } from "@/app/actions/blogs";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [profile, projects, blogs] = await Promise.all([
    getProfile(),
    getProjects(),
    getBlogs(),
  ]);

  return (
    <SmoothScroll>
      <main
        id="home"
        className="max-w-5xl mx-auto px-6 pt-24 sm:pt-32 pb-16 space-y-24"
      >
        <Hero profile={profile} />
        <Projects projects={projects} />
        <ToolBox />
        <Thoughts blogs={blogs} />
        <Contact />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
