"use client";

export default function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large floating gradient orbs with enhanced glow */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-cyan-500/30 rounded-full blur-3xl animate-float opacity-60" />
      <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-full blur-3xl animate-float-delayed opacity-50" />
      <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-br from-cyan-500/25 via-blue-500/15 to-purple-500/25 rounded-full blur-3xl animate-float-slow opacity-55" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-pink-500/20 via-purple-500/15 to-blue-500/20 rounded-full blur-3xl animate-float opacity-45" />
      
      {/* Smaller accent orbs */}
      <div className="absolute top-1/4 left-1/3 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl animate-float-delayed" />
      <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-purple-400/10 rounded-full blur-2xl animate-float-slow" />
      
      {/* Grid pattern overlay with gradient */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" 
           style={{
             backgroundImage: `
               linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
               linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px)
             `,
             backgroundSize: '50px 50px'
           }}
      />
      
      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/10" />
      
      {/* Subtle noise texture for premium look */}
      <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
           style={{
             backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'
           }}
      />
    </div>
  );
}
