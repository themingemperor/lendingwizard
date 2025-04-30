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
# @https_fn.on_request()
# def on_request_example(req: https_fn.Request) -> https_fn.Response:
#     """Example HTTP function that returns a greeting."""
#     return https_fn.Response("Hello from Python Firebase Functions!")

@https_fn.on_call()
def process_prompt(req: https_fn.CallableRequest) -> dict:
    """Process user prompt using OpenAI API."""
    try:
        # Get the user prompt from the request
        user_prompt = req.data.get("userprompt")
        
        if not user_prompt:
            logging.error("No prompt provided")
            return {"error": "No prompt provided"}
        
        logging.info(f"Received prompt: {user_prompt}")
        
        # Make the OpenAI API call
        completion = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_prompt}
            ]
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