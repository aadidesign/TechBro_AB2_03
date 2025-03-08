import json
import google.generativeai as genai
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

# Configure the Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

def index(request):
    """Render the chatbot interface"""
    return render(request, 'chatbot_app/index.html')

@csrf_exempt
def chat_api(request):
    """API endpoint to process chat requests"""
    if request.method == 'POST':
        try:
            # Parse the JSON data from the request
            data = json.loads(request.body)
            user_input = data.get('message', '')
            
            if not user_input:
                return JsonResponse({'error': 'No message provided'}, status=400)
            
            # Add CDSS context to the user input
            prompt = f"""
            You are an AI-powered Clinical Decision Support System (CDSS) chatbot. 
            Your job is to assist doctors by analyzing symptoms, suggesting potential diagnoses, 
            and providing medication advice.
            
            Doctor's Query: {user_input}
            """
            
            # Generate response from Gemini
            response = model.generate_content(prompt)
            
            # Return the response
            return JsonResponse({
                'message': response.text,
                'status': 'success'
            })
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Only POST requests are allowed'}, status=405) 