from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from openai import OpenAI
from openai import AuthenticationError, RateLimitError, APIError
import os
import json
import random
import logging
import sys
from dotenv import load_dotenv

# Configure logging to work with Gunicorn
gunicorn_logger = logging.getLogger('gunicorn.error')
logger = logging.getLogger(__name__)
logger.handlers = gunicorn_logger.handlers
logger.setLevel(logging.INFO)  # Set to INFO to see all important logs

# Fallback to basic logging if not running under Gunicorn
if not logger.handlers:
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        stream=sys.stdout
    )

load_dotenv()

app = Flask(__name__)

# Configure CORS
CORS(app, 
     origins=[
         "http://localhost:5173",  # Development
         "http://localhost:5174",
         "http://localhost:5175",
         "https://crog.gg",       # Production
         "https://www.crog.gg"    # Production www subdomain
     ],
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "OPTIONS"])

# Configure OpenAI
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
if not client.api_key:
    logger.warning("OpenAI API key not found in .env file!")
else:
    logger.info("OpenAI API key loaded successfully")

def get_fantasy_prompt(use_fantasy=False):
    """Get the fantasy prompt addition if requested."""
    if use_fantasy:
        return """
        Transform this content by incorporating fantasy elements similar to those from Lord of the Rings, Narnia, or Game of Thrones. 
        Feel free to reframe achievements as epic quests, technical challenges as battles with mythical creatures, and professional growth as a hero's journey.
        You can blend real accomplishments with fantasy elements, turning data pipelines into magical streams of knowledge, 
        team collaborations into fellowship quests, and technical skills into mystical powers.
        If this content includes a name, transform it into a fantasy version that MUST include either 'Chris' or 'Christopher' as part of the name 
        (e.g., 'Christopher T. Rogers' might become 'Christopher the Radiant' or 'Chris Thunderheart, Keeper of Ancient Code').
        However, ensure the core professional accomplishments remain clear and the fantasy elements enhance rather than obscure them.
        """
    return ""

@app.route('/api/regenerate', methods=['POST', 'OPTIONS'])
def regenerate_content():
    # Handle preflight requests
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', request.headers.get('Origin', '*'))
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response, 204
        
    try:
        logger.info("=== New Regenerate Request ===")
        logger.info(f"Request Headers: {dict(request.headers)}")
        
        data = request.get_json()
        logger.info(f"Raw request data: {json.dumps(data, indent=2)}")
        
        if not data:
            logger.error("Error: No JSON data received")
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400

        section = data.get('section')
        content = data.get('content')
        is_full_regeneration = data.get('is_full_regeneration', False)
        use_fantasy = data.get('use_fantasy', False)
        regenerate_target = content.get('regenerate_target') if content else None
        
        logger.info(f"Processing request for section: {section}")
        logger.info(f"Is full regeneration: {is_full_regeneration}")
        logger.info(f"Use fantasy: {use_fantasy}")
        logger.info(f"Regenerate target: {regenerate_target}")
        logger.info(f"Content to regenerate: {json.dumps(content, indent=2)}")
        
        if not section:
            logger.error("Error: No section specified")
            return jsonify({
                'success': False,
                'error': 'Section not specified'
            }), 400

        if not client.api_key:
            logger.error("Error: OpenAI API key not configured")
            return jsonify({
                'success': False,
                'error': 'OpenAI API key not configured'
            }), 500

        # Create section-specific prompts and formatting instructions
        prompts = {
            'about': {
                'system': "You are a creative writer who specializes in professional biographies and achievements. You MUST rewrite ALL text content while preserving the core meaning and facts. Return ONLY valid JSON with no prefixes or additional text.",
                'format': """Return ONLY the JSON object with no prefixes or additional text. You MUST rewrite EVERY text field with new wording while maintaining the same core information.

                For ALL text content (display_name, bio, achievements, etc.):
                1. EVERY single text field must be rewritten with new phrasing
                2. Maintain the same core accomplishments and facts
                3. Use varied sentence structures and strong action verbs
                4. Keep all numerical metrics (percentages, numbers) exactly the same
                5. Do not copy any full sentences from the original text

                For the display_name field:
                1. Create a professional variation that includes 'Christopher' or 'Chris'
                2. Never return the exact input name
                3. Example format: 'Christopher T. Rogers' or 'Chris Rogers'

                For achievements specifically:
                1. Make each bullet point tell a compelling story
                2. Use different action verbs than the original
                3. Highlight the impact and results in a new way
                4. Ensure every achievement is rewritten, not just some
                5. Keep the same meaning but use entirely new phrasing"""
            },
            'projects': {
                'system': "You are a technical writer who specializes in project descriptions. Return ONLY valid JSON with no prefixes or additional text. Keep the core project details accurate but present them in a new, engaging way.",
                'format': "Return ONLY the JSON array with no prefixes or additional text, maintaining the same structure but with rewritten descriptions. Keep technologies and links unchanged."
            },
            'music': {
                'system': "You are a music industry writer who specializes in describing musical works and achievements. Return ONLY valid JSON with no prefixes or additional text. Keep the core details accurate but present them in a fresh, exciting way.",
                'format': "Return ONLY the JSON array with no prefixes or additional text, maintaining the same structure but with rewritten descriptions. Keep years and links unchanged."
            }
        }

        section_prompt = prompts.get(section, {
            'system': "You are a professional writer who specializes in creative content regeneration. You MUST rewrite ALL text content while preserving the core meaning. Return ONLY valid JSON with no prefixes or additional text.",
            'format': "Return ONLY the JSON content with no prefixes or additional text. You MUST rewrite EVERY text field with new phrasing while maintaining the same core information. Never return any text exactly as it appeared in the input."
        })

        # Add fantasy elements if requested
        if use_fantasy:
            if section == 'about':
                fantasy_addition = """
                Transform ALL content by incorporating fantasy elements similar to those from Lord of the Rings, Narnia, or Game of Thrones. 

                For the display_name field:
                1. Create an epic fantasy name that MUST include 'Christopher' or 'Chris'
                2. Add a fantasy title or epithet that reflects mastery over data and technology
                3. Example: 'Christopher the Dataweaver, Architect of Digital Realms'
                4. Never return the exact input name

                For EVERY bio and achievement:
                1. Reframe EACH technical accomplishment as an epic quest or magical feat
                2. Transform EVERY technical tool and platform into a mystical artifact or enchanted realm
                   - For example: 'BigQuery' becomes 'the Great Archives of Knowledge'
                   - 'Kubernetes' becomes 'the Ancient Orchestrator of Realms'
                   - 'Python' becomes 'the Serpent's Tongue of Command'
                3. Turn ALL metrics and improvements into legendary achievements
                   - Example: "90% reduction in processing time" becomes "banished 90% of the time-consuming dark forces"
                4. Convert EVERY team collaboration into an epic alliance or fellowship
                5. Transform EACH technical challenge into a battle with mythical creatures or dark forces
                6. Keep all numerical metrics exactly the same, but frame them in fantasy terms

                IMPORTANT: EVERY single piece of text must be transformed into fantasy style while preserving the core professional impact. Do not leave any text in its original form.
                """
            else:
                fantasy_addition = """
                Transform this content by incorporating fantasy elements similar to those from Lord of the Rings, Narnia, or Game of Thrones.
                Blend real accomplishments with fantasy elements while keeping the core information clear and accurate.
                """
            
            section_prompt['format'] += fantasy_addition
            logger.info("Adding fantasy elements to this regeneration!")
            logger.debug(f"Fantasy prompt addition: {fantasy_addition}")

        # Handle targeted regeneration for About section
        if section == 'about' and regenerate_target and not is_full_regeneration:
            if regenerate_target == 'bio':
                section_prompt['format'] += "\nOnly rewrite the 'bio' field, keeping all other fields exactly the same."
            elif regenerate_target == 'citadel':
                section_prompt['format'] += "\nOnly rewrite the achievements for the Citadel employment entry, keeping all other content exactly the same."
            elif regenerate_target == 'meta':
                section_prompt['format'] += "\nOnly rewrite the achievements for the Meta employment entry, keeping all other content exactly the same."
            elif regenerate_target == 'msk':
                section_prompt['format'] += "\nOnly rewrite the achievements for the Memorial Sloan Kettering employment entry, keeping all other content exactly the same."

        logger.info(f"Using prompt: {json.dumps(section_prompt, indent=2)}")

        try:
            logger.info("Making OpenAI API request...")
            messages = [
                {"role": "system", "content": section_prompt['system']},
                {"role": "user", "content": f"Original content: {json.dumps(content)}\n\nFormatting instructions: {section_prompt['format']}\n\nPlease rewrite this content, paying special attention to achievements if they exist. Each achievement should be rewritten to be more impactful while maintaining the same core accomplishments and metrics."}
            ]
            
            logger.info(f"OpenAI request messages: {json.dumps(messages, indent=2)}")
            
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                temperature=0.7,
            )
            
            logger.info("OpenAI API response received successfully")
            logger.info(f"Raw OpenAI response: {response}")
            
            # Get the generated content
            new_content = response.choices[0].message.content
            logger.info(f"Generated content: {new_content}")

            # Try to parse the response as JSON
            try:
                parsed_content = json.loads(new_content)
                logger.info("Successfully parsed response as JSON")
                return jsonify({
                    'success': True,
                    'content': parsed_content
                })
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse response as JSON: {e}")
                logger.error(f"Raw content that failed to parse: {new_content}")
                # If parsing fails, return the raw content
                return jsonify({
                    'success': False,
                    'error': f'Failed to parse OpenAI response as JSON: {str(e)}',
                    'raw_content': new_content
                }), 400

        except AuthenticationError as e:
            logger.error(f"OpenAI Authentication Error: {str(e)}")
            return jsonify({
                'success': False,
                'error': 'Invalid OpenAI API key'
            }), 401
        except RateLimitError as e:
            logger.error(f"OpenAI Rate Limit Error: {str(e)}")
            return jsonify({
                'success': False,
                'error': 'OpenAI rate limit exceeded'
            }), 429
        except APIError as e:
            logger.error(f"OpenAI API Error: {str(e)}")
            return jsonify({
                'success': False,
                'error': f'OpenAI API error: {str(e)}'
            }), 500
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}", exc_info=True)
            return jsonify({
                'success': False,
                'error': f'Unexpected error: {str(e)}'
            }), 500

    except Exception as e:
        logger.error(f"Request processing error: {str(e)}", exc_info=True)
        return jsonify({
            'success': False,
            'error': f'Request processing error: {str(e)}'
        }), 500

@app.route('/api/limits', methods=['GET'])
def get_limits():
    return jsonify({
        'token_limit': 1000000,
        'token_usage': 0,
        'remaining_tokens': 1000000
    })

if __name__ == '__main__':
    app.run(debug=True, port=5001)
