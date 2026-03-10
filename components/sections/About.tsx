"use client";

export default function About() {
  return (
    <section id="about" className="relative py-32 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      
      <div className="container relative mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold mb-4">
            About Me
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Building the Future with
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Code & AI</span>
          </h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Main content */}
            <div className="space-y-6">
              <div className="group p-6 rounded-2xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl">
                    💼
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Full Stack at Verizon</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Building robust and scalable web applications with a strong foundation in both frontend and backend technologies.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-6 rounded-2xl bg-white border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-xl">
                    🤖
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">AI & LLM Enthusiast</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Passionate about AI and Large Language Models, working with OpenAI, Claude, LangChain, and LangGraph to build intelligent applications.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Journey & Passion */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🚀</span>
                  My Journey
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Started as a Frontend Developer, mastering React and modern web technologies. Now working across the entire stack, from crafting responsive UIs to architecting scalable backend services.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Recently diving deep into AI/ML, exploring how intelligent systems can solve complex problems in healthcare and beyond.
                </p>
              </div>
              
              <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  What Drives Me
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Clean code, best practices, and staying ahead with emerging technologies. When not coding, I&apos;m exploring new tech trends and building innovative AI-powered applications.
                </p>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "8+", label: "Years Experience" },
              { value: "20+", label: "Projects Built" },
              { value: "10+", label: "Technologies" },
              { value: "100%", label: "Commitment" }
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
