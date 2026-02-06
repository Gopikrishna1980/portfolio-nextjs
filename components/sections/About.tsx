export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          About Me
        </h2>
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg mx-auto text-gray-700">
            <p className="mb-6">
              I am a Full Stack Developer currently working at <strong>Verizon</strong>, where I build 
              robust and scalable web applications. With a strong foundation in frontend development, 
              I have expanded my expertise to include full-stack technologies.
            </p>
            <p className="mb-6">
              My journey in software development began as a Frontend Developer, where I honed my 
              skills in React and modern web technologies. Today, I work across the entire stack, 
              from designing responsive user interfaces to architecting backend services.
            </p>
            <p className="mb-6">
              Recently, I have developed a strong interest in <strong>AI and Large Language Models (LLMs)</strong>, 
              working with technologies like OpenAI, Claude, LangChain, and LangGraph to build intelligent 
              applications. I am passionate about exploring how AI can enhance user experiences and solve 
              complex problems in healthcare and beyond.
            </p>
            <p className="mb-6">
              I am passionate about clean code, best practices, and staying up-to-date with the 
              latest technologies. When I am not coding, you will find me exploring new tech trends, 
              experimenting with AI technologies, and building innovative AI-powered applications.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
