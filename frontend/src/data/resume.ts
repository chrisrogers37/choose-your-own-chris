export interface Employment {
  title: string;
  company: string;
  period: string;
  achievements: readonly string[];
}

export interface Education {
  school: string;
  degree: string;
  year: string;
}

export interface AboutContent {
  bio: string;
  skills: readonly string[];
  location: string;
  email: string;
  employment: readonly Employment[];
  education: readonly Education[];
  socialLinks: {
    github: string;
    hoobe: string;
    spotify: string;
  };
}

export interface Project {
  title: string;
  description: string;
  technologies: readonly string[];
  link?: string;
  image?: string;
}

export interface MusicProject {
  title: string;
  description: string;
  role: string;
  year: string;
  link?: string;
  image?: string;
}

interface ResumeData {
  about: {
    display_name: string;
    bio: string;
    email: string;
    location: string;
    employment: Array<{
      title: string;
      company: string;
      period: string;
      achievements: string[];
    }>;
    education: Array<{
      school: string;
      degree: string;
      year: string;
    }>;
    skills: string[];
    socialLinks: {
      github: string;
      hoobe: string;
      spotify: string;
    };
  };
}

export const defaultResume: ResumeData = {
  about: {
    display_name: "Christopher T. Rogers",
    bio: "Hi, I'm Chris! I'm an Analytics Engineer at Citadel, where I specialize in building scalable data infrastructure and automation solutions. Passionate about identifying complex data challenges and gaps and transforming them into efficient solutions, I combine technical expertise with creative problem-solving to enable data-driven decision making across the organization.\n\nBeyond my core engineering work, I'm deeply interested in audio engineering and music production, often spending my evenings working on tracks or performing as a DJ in New York City venues. Check out some of my musical projects and additional links at the bottom of the page!",
    email: "christophertrogers37@gmail.com",
    location: "New York City, New York",
    employment: [
      {
        title: "Analytics Engineer",
        company: "Citadel",
        period: "2021 - Present",
        achievements: [
          "Worked to streamline and automate the Strategic Finance Data & Analytics team's data workflows, contributing to a cultural shift toward centralized, scalable operations. Helped establish core infrastructure and onboard the team to Google Kubernetes Engine (GKE) and Citadel's Airflow-like scheduler, significantly reducing manual processing time.",
          "Designed and built a configurable Python orchestration framework to automate end-to-end workflows across BigQuery, Python, and Tableau, improving dependency management and reducing redundant code while making onboarding and setup easier.",
          "Led efforts to modernize a key Tableau dashboard, improving data sourcing, calculations, and interactivity to better support decision-making. Introduced a user feedback loop, leading to refinements that increased engagement among stakeholders.",
          "Supported the migration of 100+ tables and views from SQL Server to BigQuery, helping to redesign data flows for scalability, reduced query complexity, and improved maintainability.",
          "Helped drive team-wide initiatives focused on improving development processes and reducing technical debt, including co-founding 'Tech Debt Friday'—a collaborative effort to modernize workflows and streamline legacy processes."
        ]
      },
      {
        title: "Data Scientist",
        company: "Meta",
        period: "December 2021 - February 2023",
        achievements: [
          "Worked with five Recruiting Product teams to support metric design, experimentation, and forecasting, helping to improve candidate experience and hiring efficiency.",
          "Conducted a data-driven investigation into referral candidate outcomes, identifying thousands of high-value candidates stalled in the hiring pipeline. Insights from this work helped recruiters re-engage these candidates, led to software improvements that addressed root causes, and mitigated potential reputational risks in the referral process.",
          "Used Fixed Effects modeling to quantify the variance in hiring outcomes attributable to recruiter assignment, helping inform recruiter training, assignment strategies, and tooling enhancements.",
          "Supported numerous A/B experiments by designing metrics, analyzing results, and improving experimental methodology to drive data-informed decision-making in recruiting strategies."
        ]
      },
      {
        title: "Business Intelligence Analyst II",
        company: "Memorial Sloan Kettering",
        period: "October 2018 - December 2021",
        achievements: [
          "Published author and technical lead on an NLP research study with Weill Cornell Medical College, using classification algorithms to analyze patient messages and identify patterns related to social risk factors.",
          "Conducted a longitudinal study on patient health metrics that informed hospital-wide policy updates and optimized measurement schedules to improve medication accuracy and treatment planning."
        ]
      }
    ],
    education: [
      {
        school: "Columbia University",
        degree: "MS (partial); Applied Analytics",
        year: "2021"
      },
      {
        school: "Cornell University",
        degree: "MEng in Chemical Engineering",
        year: "2015"
      },
      {
        school: "Cornell University",
        degree: "BS in Chemical Engineering",
        year: "2014"
      }
    ],
    skills: [
      "Python",
      "R",
      "SQL",
      "Tableau",
      "Google Cloud Platform",
      "BigQuery",
      "Kubernetes",
      "Data Engineering",
      "Daiquery",
      "Presto",
      "Hive",
      "Experimentation",
      "Metric Design",
      "Data Visualization",
      "ETL Pipeline Development",
      "Statistical Analysis",
      "Machine Learning",
      "Git",
      "Docker",
      "Music Production"
    ],
    socialLinks: {
      github: "https://github.com/chrisrogers37/",
      hoobe: "https://hoo.be/crog",
      spotify: "https://open.spotify.com/artist/0UotSScPTiSFPmbmjam2jn"
    }
  }
}

// Helper function to get a random transition effect
export const transitions = [
  'fade',
  'slide-up',
  'slide-down',
  'slide-left',
  'slide-right',
  'rotate',
  'scale'
] as const;

export const getRandomTransition = () => {
  return transitions[Math.floor(Math.random() * transitions.length)];
}; 