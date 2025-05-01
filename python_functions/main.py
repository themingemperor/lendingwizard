# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn
from firebase_admin import initialize_app
from openai import OpenAI
import logging
from dotenv import load_dotenv
import os
import json
import flask
import functions_framework

# Configure logging
logging.basicConfig(level=logging.INFO)

# Load environment variables from .env file
load_dotenv()

# Initialize Firebase Admin SDK
initialize_app()

# Get OpenAI API key from environment variables
openai_api_key = os.getenv('OPENAI_API_KEY')
if not openai_api_key:
    raise ValueError("OPENAI_API_KEY is not set in the .env file")

# Initialize OpenAI client
client = OpenAI(api_key=openai_api_key)

# Lazy-loaded Secret Manager client
_secret_client = None

def get_secret_manager_client():
    """Lazy-load the Secret Manager client only when needed."""
    global _secret_client
    if _secret_client is None:
        try:
            from google.cloud import secretmanager
            _secret_client = secretmanager.SecretManagerServiceClient()
        except Exception as e:
            logging.info("Secret Manager not available, using .env file")
    return _secret_client

def get_secret_key():
    """Get API key from Secret Manager if available, otherwise use .env value."""
    secret_client = get_secret_manager_client()
    if secret_client is None:
        return openai_api_key
    
    try:
        project_id = os.getenv('GCP_PROJECT', 'lendingwizard-9dc3e')
        name = f"projects/{project_id}/secrets/OPENAI_API_KEY/versions/latest"
        response = secret_client.access_secret_version(request={"name": name})
        return response.payload.data.decode("UTF-8")
    except Exception as e:
        logging.info("Using .env file for OpenAI API key")
        return openai_api_key

@https_fn.on_call()
def process_prompt(req: https_fn.CallableRequest) -> dict:
    """Process user prompt using OpenAI API."""
    try:
        # Get the conversation history from the request
        conversation_history = req.data.get("messages")
        
        if not conversation_history or not isinstance(conversation_history, list):
            logging.error("No valid message history provided")
            return {"error": "No valid message history provided"}
        
        logging.info(f"Received conversation history with {len(conversation_history)} messages")
        
        # Make the OpenAI API call
        completion = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=conversation_history
        )
        
        # Get the response message
        response_message = completion.choices[0].message.content
        
        # Log the response
        logging.info(f"OpenAI Response: {response_message}")
        
        # Return the response as a dictionary
        return {"result": response_message}
        
    except Exception as e:
        logging.error(f"Error in process_prompt: {str(e)}")
        return {"error": str(e)}

# Create Flask app
app = flask.Flask(__name__)

@app.route("/", methods=["POST", "OPTIONS"])
def handle_request():
    """Handle HTTP requests."""
    if flask.request.method == "OPTIONS":
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "3600",
        }
        return ("", 204, headers)

    headers = {"Access-Control-Allow-Origin": "*"}

    try:
        data = flask.request.get_json()
        if not data:
            return ("No data provided", 400, headers)
        
        # Convert HTTP request to callable request format
        callable_request = https_fn.CallableRequest(data)
        result = process_prompt(callable_request)
        
        return (flask.jsonify(result), 200, headers)
    except Exception as e:
        return (flask.jsonify({"error": str(e)}), 500, headers)

# Entry point for Cloud Run
@functions_framework.http
def process_prompt_http(request):
    """Entrypoint for Cloud Run - wraps the Flask app."""
    logging.info("Received request in process_prompt_http")
    
    # Create a WSGI environment from the request
    environ = {
        'REQUEST_METHOD': request.method,
        'PATH_INFO': request.path,
        'QUERY_STRING': request.query_string.decode('utf-8'),
        'CONTENT_TYPE': request.headers.get('Content-Type', ''),
        'CONTENT_LENGTH': request.headers.get('Content-Length', ''),
        'wsgi.input': request.stream,
        'wsgi.url_scheme': 'https',
        'wsgi.version': (1, 0),
        'wsgi.errors': None,
        'wsgi.multithread': False,
        'wsgi.multiprocess': False,
        'wsgi.run_once': False,
    }
    
    # Add headers to environ
    for key, value in request.headers.items():
        environ[f'HTTP_{key.upper().replace("-", "_")}'] = value
    
    # Call the Flask app
    response = app(environ, lambda status, headers: (status, headers, []))
    
    # Return the response
    return response