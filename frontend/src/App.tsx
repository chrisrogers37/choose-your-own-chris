import { useState, useEffect } from 'react'
import './App.css'
import About from './components/About'
import Portfolio from './components/Portfolio'
import { defaultResume } from './data/resume'

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [currentContent, setCurrentContent] = useState<{
    about: typeof defaultResume.about;
  }>({
    about: defaultResume.about
  });
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasModifiedContent, setHasModifiedContent] = useState(false);

  // Fetch usage info on component mount and after regeneration
  const fetchUsageInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/api/limits`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      await response.json();
    } catch (error) {
      console.error('Error fetching usage info:', error);
    }
  }

  useEffect(() => {
    // Listen for content updates from child components
    const handleContentUpdated = (event: CustomEvent) => {
      console.log('Content update received in App:', event.detail); // Debug log
      const { section, content } = event.detail;
      setCurrentContent(prev => ({
        ...prev,
        [section]: content
      }));
    };

    window.addEventListener('contentUpdated', handleContentUpdated as EventListener);

    return () => {
      window.removeEventListener('contentUpdated', handleContentUpdated as EventListener);
    };
  }, []);

  const handleRegenerate = async () => {
    if (isRegenerating) return;
    setIsRegenerating(true);
    setError(null);

    try {
      console.log('Starting regeneration with current content:', currentContent); // Debug log
      const willUseFantasy = Math.random() < 1.00; // Always true, but keeping the calculation for future flexibility
      console.log('Using fantasy mode:', willUseFantasy); // Debug log

      const aboutResponse = await fetch(`${API_URL}/api/regenerate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
          section: 'about',
          content: currentContent.about,
          is_full_regeneration: true,
          use_fantasy: willUseFantasy
        }),
      });

      if (!aboutResponse.ok) {
        throw new Error('Failed to regenerate about section');
      }

      const aboutData = await aboutResponse.json();
      if (aboutData.success) {
        console.log('New about content generated:', aboutData.content); // Debug log
        
        // Update the current content state
        setCurrentContent(prev => ({
          ...prev,
          about: aboutData.content
        }));
        
        // Mark content as modified
        setHasModifiedContent(true);

        // Dispatch the content regenerated event
        const event = new CustomEvent('contentRegenerated', {
          detail: {
            section: 'about',
            content: aboutData.content,
            is_full_regeneration: true,
            use_fantasy: willUseFantasy
          }
        });
        console.log('Dispatching contentRegenerated event:', event.detail); // Debug log
        window.dispatchEvent(event);
      }

    } catch (error) {
      console.error('Error during regeneration:', error);
    } finally {
      // Wait a bit before setting isRegenerating to false
      setTimeout(() => {
        setIsRegenerating(false);
      }, 1000);
    }
  };

  const handleReset = () => {
    // Reset content to default
    setCurrentContent({
      about: defaultResume.about
    });

    // Reset modification state
    setHasModifiedContent(false);

    // Dispatch the content regenerated event to update child components
    const event = new CustomEvent('contentRegenerated', {
      detail: {
        section: 'about',
        content: defaultResume.about,
        is_full_regeneration: true,
        use_fantasy: false
      }
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="app">
      <header>
        <div className="header-content">
          <picture>
            <source srcSet="/profile-photo.jpg" type="image/jpeg" />
            <img 
              src="/profile-photo.png" 
              alt={`${currentContent.about.display_name}'s profile photo`}
              className="profile-photo"
            />
          </picture>
          <div className="header-text">
            <h1>{currentContent.about.display_name}</h1>
            <div className="contact-header">
              <p>📍 {currentContent.about.location}</p>
              <p>📧 <a href={`mailto:${currentContent.about.email}`}>{currentContent.about.email}</a></p>
            </div>
          </div>
        </div>
        <div className="button-group">
          <button 
            className="generate-btn"
            onClick={handleRegenerate}
            disabled={isRegenerating}
          >
            {isRegenerating ? 'Weaving Epic Saga...' : 'SUMMON NEW LORE'}
          </button>
          {hasModifiedContent && (
            <button 
              className="reset-btn"
              onClick={handleReset}
              disabled={isRegenerating}
            >
              DISPEL ENCHANTMENT
            </button>
          )}
        </div>
      </header>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <main>
        <section className="section-content">
          <About onRegenerate={fetchUsageInfo} />
        </section>

        <section className="section-content">
          <Portfolio />
        </section>
      </main>
    </div>
  )
}

export default App
