# Choose Your Own Chris

An interactive portfolio website featuring dynamic content generation using OpenAI's GPT-3.5. The site showcases professional experience, projects, and musical endeavors with a unique twist - content can be regenerated on demand for a fresh perspective!

## Features

- Dynamic content generation for all sections using OpenAI's GPT-3.5
- Modern, responsive design
- Sections for About Me, Projects, and Music
- Individual section regeneration or full site regeneration
- Clean and intuitive user interface

## Tech Stack

- Frontend:
  - React
  - TypeScript
  - Vite
  - Modern CSS with CSS Variables
- Backend:
  - Flask
  - OpenAI API
  - Python

## Setup

### Prerequisites

- Node.js (v14 or higher)
- Python 3.7+
- OpenAI API key

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

5. Start the Flask server:
   ```bash
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

## Usage

1. Browse through the different sections of the portfolio
2. Click the "GENERATE CHRIS" button at the top to regenerate all content
3. Use individual "Regenerate" buttons in each section to refresh specific content
4. All generated content maintains accuracy while presenting information in new and creative ways

## Development

- Frontend code is in the `frontend/src` directory
- Backend code is in the `backend` directory
- Styles are managed in `frontend/src/App.css`
- Each section is a separate component in `frontend/src/components`

## License

MIT 