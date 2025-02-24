# Choose Your Own Chris

An interactive portfolio website featuring dynamic content generation using OpenAI's GPT-3.5. The site showcases professional experience, projects, and musical endeavors with a unique twist - content can be regenerated on demand for a fresh perspective!

## Features

### Dynamic Content Generation
- **AI-Powered Regeneration**: Uses OpenAI's GPT-3.5 to create unique variations of content while maintaining factual accuracy
- **Fantasy Mode**: Transform professional experiences into epic fantasy narratives
- **Section-Specific Updates**: Ability to regenerate individual sections or the entire portfolio
- **Smooth Transitions**: Elegant animations when content changes

### Professional Sections
- **About Me**: Dynamic biography and professional summary
- **Experience**: Interactive work history with achievements
- **Education**: Academic background and qualifications
- **Skills**: Comprehensive list of technical and professional skills

### Portfolio Integration
- **Technical Projects**: Showcase of development work and side projects
- **Music Portfolio**: Integration with Spotify artist profile
- **Social Links**: Connected profiles and professional networks

### Technical Features
- **Modern Stack**: React + TypeScript frontend, Flask backend
- **Responsive Design**: Mobile-friendly layout with CSS Grid and Flexbox
- **CORS Support**: Secure cross-origin communication between frontend and API
- **Error Handling**: Robust error management for API interactions
- **Rate Limiting**: Token usage tracking and request limiting
- **Smooth Animations**: CSS transitions for content updates

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- CSS Variables for theming
- React Transition Group for animations

### Backend
- Flask
- OpenAI API
- Python 3.10+
- Gunicorn for production serving
- Nginx for reverse proxy

## Local Development Setup

### Prerequisites
- Node.js (v14 or higher)
- Python 3.10+
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

3. Create a `.env` file for local development:
   ```
   VITE_API_URL=http://localhost:5001
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5173`

## Production Deployment

### Server Prerequisites
- Ubuntu 20.04 or later
- Nginx
- Python 3.10+
- Node.js 14+
- SSL certificates (Let's Encrypt)

### Backend Deployment
1. Set up Nginx configuration for the API:
   ```nginx
   server {
       listen 443 ssl;
       server_name api.yourdomain.com;
       
       ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
       
       location / {
           proxy_pass http://127.0.0.1:5001;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

2. Set up systemd service for Flask:
   ```ini
   [Unit]
   Description=Flask Application
   After=network.target

   [Service]
   User=www-data
   WorkingDirectory=/var/www/api.yourdomain.com/backend
   Environment="PATH=/var/www/api.yourdomain.com/venv/bin"
   ExecStart=/var/www/api.yourdomain.com/venv/bin/gunicorn --workers 3 --bind 127.0.0.1:5001 app:app

   [Install]
   WantedBy=multi-user.target
   ```

3. Enable and start the service:
   ```bash
   systemctl enable flask
   systemctl start flask
   ```

### Frontend Deployment
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Set up Nginx configuration for the frontend:
   ```nginx
   server {
       listen 443 ssl;
       server_name yourdomain.com;
       
       ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
       
       root /var/www/yourdomain.com/frontend/dist;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

### Common Issues and Solutions
1. **502 Bad Gateway**: Usually indicates the Flask application isn't running or Nginx configuration is incorrect
   - Check Flask service status: `systemctl status flask`
   - Verify Nginx configuration: `nginx -t`
   - Check logs: `journalctl -u flask`

2. **OpenAI API Issues**: 
   - Verify API key in `.env`
   - Check for rate limiting
   - Update OpenAI package if encountering import errors

3. **CORS Issues**:
   - Verify allowed origins in Flask CORS configuration
   - Check Nginx headers
   - Confirm frontend API URL configuration

## License

MIT 