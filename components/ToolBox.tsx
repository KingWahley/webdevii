interface Tool {
  name: string;
  category: string;
  iconClass: string;
}

const tools: Tool[] = [
  { name: "Figma", category: "Design & Prototyping", iconClass: "devicon-figma-plain" },
  { name: "Photoshop", category: "Photo & Graphics", iconClass: "devicon-photoshop-plain" },
  { name: "Adobe XD", category: "UI/UX Prototyping", iconClass: "devicon-xd-plain" },
  { name: "HTML", category: "Markup Language", iconClass: "devicon-html5-plain" },
  { name: "Tailwind CSS", category: "CSS Framework", iconClass: "devicon-tailwindcss-original" },
  { name: "JavaScript", category: "Programming Language", iconClass: "devicon-javascript-plain" },
  { name: "TypeScript", category: "Typed JavaScript", iconClass: "devicon-typescript-plain" },
  { name: "React", category: "Frontend Library", iconClass: "devicon-react-original" },
  { name: "Next.js", category: "React Framework", iconClass: "devicon-nextjs-plain" },
  { name: "Flask", category: "Python Web Framework", iconClass: "devicon-flask-original" },
  { name: "Python", category: "Programming Language", iconClass: "devicon-python-plain" },
  { name: "Firebase", category: "Backend-as-a-Service", iconClass: "devicon-firebase-plain" },
  { name: "Supabase", category: "Open Source Firebase", iconClass: "devicon-supabase-plain" },
  { name: "Node.js", category: "JavaScript Runtime", iconClass: "devicon-nodejs-plain" },
  { name: "React Native", category: "Mobile Framework", iconClass: "devicon-react-original" },
];

export default function ToolBox() {
  return (
    <section id="tools" className="space-y-12">
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white uppercase font-display leading-[0.95] sm:leading-[0.85] mb-8 sm:mb-12">
        My
        <br />
        <span className="text-[#2C2C2C]">Tool Box</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <div
            key={tool.name}
            className="bg-cardBg border border-[#262626] p-5 rounded-2xl flex items-center gap-4 hover:border-neutral-700 hover:bg-[#1C1C1C] transition duration-300 group tool-card"
          >
            <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center border border-neutral-800 text-white group-hover:text-[#FF6B35] transition duration-300">
              <i className={`${tool.iconClass} text-3xl`}></i>
            </div>
            <div>
              <h4 className="font-extrabold text-white text-base font-display">
                {tool.name}
              </h4>
              <p className="text-xs text-neutral-500 mt-0.5">{tool.category}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
