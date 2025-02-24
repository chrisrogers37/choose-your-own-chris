import React from 'react';

const LINKS = {
  github: "https://github.com/chrisrogers37/",
  shuffify: "https://shuffify.app",
  hoobe: "https://hoo.be/crog",
  spotify: "https://open.spotify.com/artist/0UotSScPTiSFPmbmjam2jn"
} as const;

function Portfolio() {
  return (
    <div className="portfolio-section">
      <div className="section-header">
        <h2>Projects & Music</h2>
      </div>

      <div className="portfolio-content">
        <div className="portfolio-projects">
          <div className="section-header-with-subtitle">
            <h3>Technical Projects</h3>
            <span className="section-subtitle">Check out what I'm building</span>
          </div>
          <div className="links-grid">
            <a 
              href={LINKS.shuffify}
              target="_blank" 
              rel="noopener noreferrer"
              className="portfolio-link"
            >
              <i className="fas fa-music"></i>
              <div>
                <span className="link-title">Shuffify</span>
                <span className="link-description">Intelligent playlist shuffling app</span>
              </div>
            </a>
          </div>
          <div className="links-grid">
            <a 
              href={LINKS.github}
              target="_blank" 
              rel="noopener noreferrer"
              className="portfolio-link call-to-action"
            >
              <i className="fab fa-github"></i>
              <div>
                <span className="link-title">More projects on GitHub</span>
                <span className="link-description">Open source projects & contributions</span>
              </div>
            </a>
          </div>
        </div>

        <div className="music-portfolio">
          <div className="section-header-with-subtitle">
            <h3>Music</h3>
            <span className="section-subtitle">I make music sometimes!!!!</span>
          </div>
          <div className="spotify-embed">
            <iframe
              src={`https://open.spotify.com/embed/artist/${LINKS.spotify.split('/').pop()}`}
              width="100%"
              height="380"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify Artist Embed"
            />
          </div>
          <div className="links-grid">
            <a 
              href={LINKS.hoobe}
              target="_blank" 
              rel="noopener noreferrer"
              className="portfolio-link call-to-action"
            >
              <i className="fas fa-arrow-right"></i>
              <div>
                <span className="link-title">More music content</span>
                <span className="link-description">Projects, releases, shows, and social</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Portfolio; 