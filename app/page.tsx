import SmoothScroll from "@/components/SmoothScroll";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import ToolBox from "@/components/ToolBox";
import Thoughts from "@/components/Thoughts";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      <main
        id="home"
        className="max-w-5xl mx-auto px-6 pt-24 sm:pt-32 pb-16 space-y-24"
      >
        <Hero />
        <Projects />
        <ToolBox />
        <Thoughts />
        <Contact />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
