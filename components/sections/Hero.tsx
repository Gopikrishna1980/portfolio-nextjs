"use client";

import FloatingElements from "../FloatingElements";

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <FloatingElements />
      
      <div className="container relative z-10 mx-auto px-6 py-32">
        <div className="max-w-5xl mx-auto">
          {/* Premium badge */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm shimmer-effect gradient-border">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-medium text-gray-300">Available for opportunities</span>
            </div>
          </div>
          
          {/* Main heading with gradient */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-center animate-fade-in-up">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-purple-200">
              Gopikrishna
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400">
              Venepalli
            </span>
          </h1>
          
          {/* Subtitle */}
          <div className="text-center mb-8 animate-fade-in-up animation-delay-200">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-300 mb-4">
              Full Stack Developer <span className="text-blue-400">@Verizon</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Crafting intelligent, scalable applications with{" "}
              <span className="text-blue-400 font-semibold">AI</span>,{" "}
              <span className="text-green-400 font-semibold">Python</span>,{" "}
              <span className="text-blue-500 font-semibold">TypeScript</span>,{" "}
              <span className="text-purple-400 font-semibold">React</span>, and{" "}
              <span className="text-cyan-400 font-semibold">Next.js</span>.
              <br />Building the future, one line of code at a time.
            </p>
          </div>
          
          {/* CTA Buttons with glassmorphism */}
          <div className="flex gap-4 justify-center flex-wrap mb-16 animate-fade-in-up animation-delay-400">
            <a
              href="#projects"
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 glow-effect btn-magnetic"
            >
              <span className="relative z-10">View My Work</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            <a
              href="#contact"
              className="group px-8 py-4 rounded-xl font-semibold text-white border-2 border-gray-700 backdrop-blur-sm bg-white/5 hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 hover-lift shimmer-effect"
            >
              <span className="group-hover:text-blue-400 transition-colors">Get In Touch</span>
            </a>
          </div>
          
          {/* Features cards with glassmorphism */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in-up animation-delay-600">
            {[
              { icon: "🤖", title: "AI Integration", desc: "LangChain, OpenAI, Claude" },
              { icon: "⚡", title: "Full Stack", desc: "React, Next.js, Node.js" },
              { icon: "🎨", title: "Modern UI", desc: "Tailwind, Framer Motion" }
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300 card-3d holographic"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-gray-600 flex justify-center p-2">
          <div className="w-1 h-3 bg-gradient-to-b from-blue-400 to-transparent rounded-full" />
        </div>
      </div>
    </section>
  );
}
