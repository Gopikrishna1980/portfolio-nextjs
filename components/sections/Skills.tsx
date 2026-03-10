"use client";

import { skills } from "@/data/portfolio";

const categoryIcons: Record<string, string> = {
  "Frontend": "🎨",
  "Backend": "⚙️",
  "Database & Caching": "💾",
  "Testing & Quality": "✅",
  "DevOps & Tools": "🚀",
  "Cloud & Infrastructure": "☁️",
  "Architecture & Patterns": "🏗️",
  "AI & Automation": "🤖",
  "AI/ML & LLM": "🧠"
};

export default function Skills() {
  return (
    <section id="skills" className="relative py-32 bg-gradient-to-b from-white via-blue-50/30 to-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />
      
      <div className="container relative mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold mb-4">
            Technical Expertise
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Skills & <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Technologies</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A comprehensive toolkit for building modern, scalable applications
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skillGroup, index) => (
            <div
              key={skillGroup.category}
              className="group p-6 rounded-2xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Header with icon */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                  {categoryIcons[skillGroup.category] || "💻"}
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {skillGroup.category}
                </h3>
              </div>
              
              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {skillGroup.items.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-gradient-to-br from-blue-50 to-purple-50 text-blue-700 rounded-lg text-sm font-medium hover:from-blue-100 hover:to-purple-100 hover:scale-105 transition-all duration-200 cursor-default border border-blue-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
