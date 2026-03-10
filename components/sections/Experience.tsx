"use client";

import { experiences } from "@/data/portfolio";

export default function Experience() {
  return (
    <section id="experience" className="relative py-32 bg-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      
      <div className="container relative mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="inline-block px-4 py-2 rounded-full bg-purple-100 text-purple-600 text-sm font-semibold mb-4">
            Career Journey
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Work <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Experience</span>
          </h2>
        </div>
        
        <div className="max-w-5xl mx-auto space-y-6">
          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              className="group relative p-8 rounded-2xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient accent line */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {exp.position}
                    </h3>
                    <p className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {exp.company}
                    </p>
                  </div>
                  <div className="mt-3 md:mt-0 flex flex-col items-start md:items-end gap-1">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold border border-blue-200">
                      {exp.duration}
                    </span>
                    <span className="text-gray-600 text-sm">{exp.location}</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {exp.description.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
