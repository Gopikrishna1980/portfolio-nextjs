import { experiences, projects, skills } from "@/data/portfolio";

const featuredProjects = projects.slice(0, 4);
const primarySkills = skills.slice(0, 6);

const Arrow = ({ diagonal = false }: { diagonal?: boolean }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
    <path d={diagonal ? "M7 17 17 7M8 7h9v9" : "M5 12h14m-5-5 5 5-5 5"} />
  </svg>
);

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Gopikrishna Venepalli, home">
          <span>GV</span>
          <span className="brand-copy">Gopikrishna<br />Venepalli</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#experience">Experience</a>
          <a href="#about">About</a>
        </nav>
        <a className="nav-cta" href="mailto:krishna1980.venepalli@gmail.com">
          Let&apos;s talk <Arrow diagonal />
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="orbit orbit-one" aria-hidden="true" />
        <div className="orbit orbit-two" aria-hidden="true" />

        <div className="hero-copy">
          <p className="eyebrow"><span /> Full-stack developer · AI builder</p>
          <h1>I build systems<br />that <em>think</em> and scale.</h1>
          <p className="hero-lede">
            I&apos;m Gopikrishna, a full-stack developer at Verizon turning complex
            product problems into clear, resilient digital experiences.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">Explore selected work <Arrow /></a>
            <a className="text-link" href="#experience">8+ years in the field <Arrow diagonal /></a>
          </div>
        </div>

        <div className="spatial-stage" aria-label="Interactive-style overview of Gopikrishna's expertise">
          <div className="stage-shadow" />
          <div className="stage-card stage-main">
            <div className="window-bar"><span /><span /><span /><small>GV / workspace</small></div>
            <div className="stage-content">
              <span className="status"><i /> Available for select opportunities</span>
              <p className="stage-label">CURRENT FOCUS</p>
              <strong>Intelligent products,<br />built end to end.</strong>
              <div className="signal-row">
                <span>AI / RAG</span><span>React</span><span>Java</span><span>Python</span>
              </div>
            </div>
          </div>
          <div className="stage-card stage-note">
            <span className="note-icon">↗</span>
            <small>SHIPPING AT</small>
            <strong>Verizon</strong>
            <p>Scalable platforms<br />&amp; modern interfaces</p>
          </div>
          <div className="stage-card stage-code" aria-hidden="true">
            <span>01</span><i /><i /><i /><b>build()</b><i /><i />
          </div>
          <div className="stage-node node-one" aria-hidden="true">AI</div>
          <div className="stage-node node-two" aria-hidden="true">UI</div>
        </div>

        <div className="hero-footer">
          <span>Based in the US · Working remotely</span>
          <span className="scroll-cue">Scroll to explore <i /></span>
        </div>
      </section>

      <section className="proof-strip" aria-label="Professional highlights">
        <div><strong>8+</strong><span>Years building<br />digital products</span></div>
        <div><strong>20+</strong><span>Products &amp;<br />platforms shipped</span></div>
        <div><strong>Full stack</strong><span>Interface to<br />infrastructure</span></div>
        <div><strong>AI native</strong><span>RAG, agents &amp;<br />automation</span></div>
      </section>

      <section className="section projects-section" id="work">
        <div className="section-heading">
          <p className="eyebrow"><span /> Selected work</p>
          <h2>Complex under the hood.<br /><em>Effortless</em> on the surface.</h2>
          <p>AI systems and full-stack platforms designed around real users, measurable outcomes, and long-term maintainability.</p>
        </div>

        <div className="project-grid">
          {featuredProjects.map((project, index) => {
            const hasRealGithub = project.githubUrl && !project.githubUrl.includes("yourusername");
            const hasVerifiedLive = index === 0 && project.liveUrl;
            return (
              <article className={`project-card project-${index + 1}`} key={project.id}>
                <div className="project-index">0{index + 1}</div>
                <div className="project-visual" aria-hidden="true">
                  <div className="visual-plane plane-back" />
                  <div className="visual-plane plane-mid" />
                  <div className="visual-plane plane-front">
                    <span>{index === 0 ? "AI" : index === 1 ? "CX" : index === 2 ? "$" : "↗"}</span>
                    <i /><i /><i />
                  </div>
                </div>
                <div className="project-copy">
                  <p>{index === 0 ? "Agentic healthcare" : index === 1 ? "Enterprise support" : index === 2 ? "Secure commerce" : "Live intelligence"}</p>
                  <h3>{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="tags">
                    {project.technologies.slice(0, 5).map((tech) => <span key={tech}>{tech}</span>)}
                  </div>
                  {(hasRealGithub || hasVerifiedLive) && (
                    <div className="project-links">
                      {hasRealGithub && <a href={project.githubUrl} target="_blank" rel="noreferrer">View repository <Arrow diagonal /></a>}
                      {hasVerifiedLive && <a href={project.liveUrl} target="_blank" rel="noreferrer">Live product <Arrow diagonal /></a>}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section experience-section" id="experience">
        <div className="experience-intro">
          <p className="eyebrow"><span /> Experience</p>
          <h2>Built across the<br /><em>whole stack.</em></h2>
          <p>From responsive interfaces to distributed services, I bring product thinking to every layer.</p>
          <a className="button button-dark" href="mailto:krishna1980.venepalli@gmail.com?subject=Resume%20request">Request my résumé <Arrow /></a>
        </div>
        <div className="timeline">
          {experiences.map((experience, index) => (
            <article className="timeline-item" key={experience.id}>
              <div className="timeline-rail"><span className={index === 0 ? "active" : ""} /></div>
              <div className="timeline-date">{experience.duration}</div>
              <div className="timeline-copy">
                <div className="role-line">
                  <h3>{experience.position}</h3>
                  {index === 0 && <span>NOW</span>}
                </div>
                <p className="company">{experience.company} · {experience.location}</p>
                <p>{experience.description[0].replace(/<[^>]+>/g, "")}</p>
                <div className="tags compact">
                  {experience.technologies.slice(0, 6).map((tech) => <span key={tech}>{tech}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section about-section" id="about">
        <div className="about-statement">
          <p className="eyebrow light"><span /> How I work</p>
          <h2>Engineering with<br />a <em>product pulse.</em></h2>
          <p>I care about the space between solid architecture and a great human experience. That means asking better questions, reducing friction, and leaving systems clearer than I found them.</p>
        </div>
        <div className="principles">
          <article><span>01</span><h3>Clarity over cleverness</h3><p>Simple flows, readable systems, and decisions people can understand.</p></article>
          <article><span>02</span><h3>Prototype with purpose</h3><p>Move fast enough to learn, then harden the ideas that prove their value.</p></article>
          <article><span>03</span><h3>Own the outcome</h3><p>Think beyond the ticket—from user need to production reliability.</p></article>
        </div>
      </section>

      <section className="section capabilities-section" id="skills">
        <div className="section-heading compact-heading">
          <p className="eyebrow"><span /> Capabilities</p>
          <h2>One builder.<br /><em>Many layers.</em></h2>
        </div>
        <div className="capability-grid">
          {primarySkills.map((group, index) => (
            <article key={group.category}>
              <span className="cap-number">0{index + 1}</span>
              <h3>{group.category}</h3>
              <p>{group.items.slice(0, 7).join(" · ")}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-orbit" aria-hidden="true"><span>GV</span></div>
        <p className="eyebrow light"><span /> Start a conversation</p>
        <h2>Have a hard problem?<br /><em>Let&apos;s make it simple.</em></h2>
        <a className="contact-link" href="mailto:krishna1980.venepalli@gmail.com">
          krishna1980.venepalli@gmail.com <Arrow diagonal />
        </a>
        <div className="social-row">
          <a href="https://github.com/Gopikrishna1980" target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href="https://www.linkedin.com/in/gopikrishna-venepalli-a6a528b4/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
        </div>
      </section>

      <footer>
        <span>© {new Date().getFullYear()} Gopikrishna Venepalli</span>
        <span>Designed with depth. Built with care.</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
