import { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import { defaultResume, getRandomTransition } from '../data/resume';
import '../styles/transitions.css';

const API_URL = import.meta.env.VITE_API_URL;

interface AboutProps {
  onRegenerate: () => void;
}

type AboutContent = typeof defaultResume.about;

function About({ onRegenerate }: AboutProps) {
  const [content, setContent] = useState<AboutContent>(defaultResume.about);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bioInProp, setBioInProp] = useState(true);
  const [citadelInProp, setCitadelInProp] = useState(true);
  const [metaInProp, setMetaInProp] = useState(true);
  const [mskInProp, setMskInProp] = useState(true);

  useEffect(() => {
    // Listen for content regeneration events
    const handleContentRegenerated = (event: CustomEvent) => {
      console.log('Content regeneration event received:', event.detail); // Debug log
      if (event.detail.section === 'about') {
        // First, trigger the fade out
        setBioInProp(false);
        setCitadelInProp(false);
        setMetaInProp(false);
        setMskInProp(false);
        setIsLoading(true);

        // Wait for fade out to complete before updating content
        setTimeout(() => {
          const newContent = event.detail.content;
          console.log('Setting new content in About component:', newContent); // Debug log
          
          // Update the local state
          setContent(newContent);
          
          // Dispatch contentUpdated event to notify parent
          const updateEvent = new CustomEvent('contentUpdated', {
            detail: {
              section: 'about',
              content: newContent
            }
          });
          console.log('Dispatching contentUpdated event:', updateEvent.detail); // Debug log
          window.dispatchEvent(updateEvent);
          
          // Then trigger fade in
          setTimeout(() => {
            setBioInProp(true);
            setCitadelInProp(true);
            setMetaInProp(true);
            setMskInProp(true);
            setIsLoading(false);
            onRegenerate();
          }, 100);
        }, 500);
      }
    };

    window.addEventListener('contentRegenerated', handleContentRegenerated as EventListener);

    return () => {
      window.removeEventListener('contentRegenerated', handleContentRegenerated as EventListener);
    };
  }, [onRegenerate]);

  // Add effect to dispatch content updates whenever content changes
  useEffect(() => {
    console.log('Content state updated in About component:', content); // Debug log
    const event = new CustomEvent('contentUpdated', {
      detail: {
        section: 'about',
        content
      }
    });
    window.dispatchEvent(event);
  }, [content]);

  return (
    <div className="about-section">
      <div className="section-header">
        <h2>About Me</h2>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="about-content">
        <div className="bio-container">
          <CSSTransition
            in={bioInProp}
            timeout={500}
            classNames="fade"
            unmountOnExit={false}
          >
            <div className="bio">
              {content.bio.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </CSSTransition>
          {isLoading && (
            <div className="loading-overlay">
              <div className="spinner" />
            </div>
          )}
        </div>
        
        {content.employment && content.employment.length > 0 && (
          <div className="employment-section">
            <div className="section-header-with-subtitle">
              <h3>Experience</h3>
              <span className="section-subtitle">The good ol' 9-5s</span>
            </div>
            <div>
              {content.employment.map((job, index) => (
                <div key={index} className="job-card">
                  <CSSTransition
                    in={
                      job.company === "Citadel" ? citadelInProp :
                      job.company === "Meta" ? metaInProp :
                      mskInProp
                    }
                    timeout={500}
                    classNames="fade"
                    unmountOnExit={false}
                  >
                    <div>
                      <div className="job-header">
                        <div className="job-title-section">
                          <h4>{job.title}</h4>
                        </div>
                        <span className="company">{job.company}</span>
                        <span className="period">{job.period}</span>
                      </div>
                      <ul className="achievements">
                        {job.achievements.map((achievement, i) => (
                          <li key={i}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  </CSSTransition>
                  {isLoading && (
                    <div className="loading-overlay">
                      <div className="spinner" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {content.education && content.education.length > 0 && (
          <div className="education-section">
            <div className="section-header-with-subtitle">
              <h3>Education</h3>
              <span className="section-subtitle">I went to school a few times...</span>
            </div>
            <div className="education-grid">
              {content.education.map((edu, index) => (
                <div key={index} className="education-card">
                  <h4>{edu.school}</h4>
                  <p className="degree">{edu.degree}</p>
                  <p className="year">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="skills-section">
          <h3>Skills</h3>
          <div className="skills-grid">
            {content.skills.map((skill, index) => (
              <span key={index} className="tech-tag">{skill}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default About; 