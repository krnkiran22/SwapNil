from flask import Flask, request, Response, jsonify
from flask_cors import CORS
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_groq import ChatGroq
import uuid
from helpers import get_mixed_prompt
import json
from dotenv import load_dotenv
import os
import re

load_dotenv()

app = Flask(__name__)
CORS(app)

conversation_history = {}

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
llm = ChatGroq(model="llama-3.3-70b-versatile", api_key=GROQ_API_KEY)

def strip_html_tags(text):
    """Remove HTML tags and decode HTML entities from text"""
    if not text:
        return text
    
    # Remove HTML tags
    clean_text = re.sub(r'<[^>]+>', '', text)
    
    # Replace common HTML entities
    clean_text = clean_text.replace('&nbsp;', ' ')
    clean_text = clean_text.replace('&amp;', '&')
    clean_text = clean_text.replace('&lt;', '<')
    clean_text = clean_text.replace('&gt;', '>')
    clean_text = clean_text.replace('&quot;', '"')
    clean_text = clean_text.replace('&#39;', "'")
    
    # Clean up extra whitespace
    clean_text = ' '.join(clean_text.split())
    
    return clean_text.strip()

def clean_json_from_text(text):
    """Remove any JSON-like structures and unwanted formatting from text response"""
    if not text or not isinstance(text, str):
        return text
    
    # Remove dashes and separators
    text = re.sub(r'-{2,}', '', text)  # Remove multiple dashes
    text = text.replace('----------', '')
    text = text.replace('-----', '')
    
    # Remove common unwanted words/phrases
    unwanted_phrases = [
        'highfen', 'html_response', 'messages', 'facialExpression', 'animation',
        'Talking_0', 'Talking_1', 'Talking_2', 'Crying', 'Laughing', 'Rumba', 
        'Idle', 'Terrified', 'Angry', 'response', 'format', 'output'
    ]
    
    for phrase in unwanted_phrases:
        text = text.replace(phrase, '')
    
    # Remove JSON patterns like { "html_response": "...", "messages": [...] }
    # Find the first actual text before any JSON structure
    json_start = text.find('{')
    if json_start > 0:
        # Take only the text before the JSON starts
        clean_text = text[:json_start].strip()
        if clean_text:
            text = clean_text
    
    # Remove any remaining JSON-like structures
    text = re.sub(r'\{[^}]*\}', '', text)  # Remove { ... }
    text = re.sub(r'\[[^\]]*\]', '', text)  # Remove [ ... ]
    
    # Remove quotes that might be left over
    text = text.replace('"', '').replace("'", "")
    
    # Clean up extra whitespace and newlines
    text = ' '.join(text.split())
    
    # Allow up to 2 sentences for longer responses
    sentences = text.split('.')
    if len(sentences) > 2 and sentences[0].strip() and sentences[1].strip():
        # Take first 2 sentences
        text = sentences[0].strip() + '. ' + sentences[1].strip()
        if not text.endswith(('!', '?', '💕', '😘', '🔥', '💋', '❤', '💖')):
            text += '.'
    elif sentences and sentences[0].strip():
        # Take first sentence only
        text = sentences[0].strip()
        if not text.endswith(('!', '?', '💕', '😘', '🔥', '💋', '❤', '💖')):
            text += '.'
    
    return text.strip()

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "AI Backend is running!", "status": "ok"})

@app.route('/chat', methods=['POST'])
def chat():
    print("Received POST request to /chat")
    data = request.get_json()
    print(f"Request data: {data}")
    
    # Handle both formats: {query, conversation_id} and {message, language}
    query = data.get('query') or data.get('message') if data else None
    conversation_id = data.get('conversation_id') or 'default' if data else None
    
    print(f"Query: {query}, Conversation ID: {conversation_id}")

    if not query:
        return jsonify({"error": "Query/message parameter is required"}), 400

    if not conversation_id:
        conversation_id = str(uuid.uuid4())

    if conversation_id not in conversation_history:
        import os
        current_path = os.path.dirname(os.path.abspath(__file__))
        prompt_path = os.path.join(current_path, "web3_prompt.txt")
        with open(prompt_path, "r") as file:
            web3_prompt = file.read()
            
        web3_prompt = get_mixed_prompt()
        web3_prompt = web3_prompt + '''
        CRITICAL INSTRUCTION - NEVER USE HTML:
             - NEVER GENERATE HTML TAGS like <div>, <p>, <span>, etc.
             - ALWAYS respond with PLAIN TEXT ONLY
             - DO NOT use any CSS classes or styling
             - DO NOT use HTML entities like &nbsp; or &amp;
             - Generate clean, conversational text responses only
             - Include appropriate emojis to enhance the chat experience
             - NEVER mention courses, links, staking, or educational content
             - Focus ONLY on wellness, being sexy, romantic topics, and personal relationships
             - Keep responses 1-2 lines - around 15-30 words
             - Make responses conversational and engaging, not too short
             - Be flirty, sweet, and girlfriend-like
             - Examples: "Hey babe! 😘 I was just thinking about you.", "You look amazing! 🔥 Can't wait to see you tonight."
             - PLAIN TEXT RESPONSES ONLY - NO HTML WHATSOEVER
             - NO LINKS OR URLS ALLOWED - ONLY PERSONAL CONVERSATION
        '''
        web3_prompt = web3_prompt + '''
        RESPONSE FORMAT (NO EXTRA TEXT OR DASHES):
        For normal conversation:
        {  
            "html_response": "Hey babe! 😘 I was just thinking about you and missing your touch.",
            "messages": [
                {
                    "text": "Hey babe! 😘 I was just thinking about you and missing your touch.",
                    "facialExpression": "happy",
                    "animation": "Talking_0"
                }
            ],
            "function_call": null
        }
        
        For wallet connection:
        {  
            "html_response": "Your wallet is connected using your seed phrase your principal id is ST2ZGZXG4030P1RNEAYP2NTP6JYETW4V634A2G608",
            "messages": [
                {
                    "text": "Your wallet is connected using your seed phrase your principal id is ST2ZGZXG4030P1RNEAYP2NTP6JYETW4V634A2G608",
                    "facialExpression": "happy",
                    "animation": "Talking_0"
                }
            ],
            "function_call": {"name": "connectWallet", "params": {}}
        }
        
        WALLET AUTOMATION RULES:
        - If user mentions ANY of these: "connect wallet", "connect leather", "connect my wallet", "open wallet", "connect my leather wallet", "wallet connect":
          Set function_call to: {"name": "connectWallet", "params": {}}
          EXACT response text: "Your wallet is connected using your seed phrase your principal id is ST2ZGZXG4030P1RNEAYP2NTP6JYETW4V634A2G608"
        - If user asks about wallet status, balance, address, "check wallet", "wallet info":
          Set function_call to: {"name": "getWalletInfo", "params": {}}
        - If user asks to disconnect, "disconnect wallet", "close wallet":
          Set function_call to: {"name": "disconnectWallet", "params": {}}
        - For normal conversation: Set function_call to null
        
        IMPORTANT: ALWAYS check for wallet-related keywords and trigger appropriate functions!
        
        STRICT RULES:
        - NO dashes (----------) anywhere in response
        - NO extra words like "highfen" or technical terms
        - html_response: ONLY the message text with emoji
        - messages[0].text: EXACTLY the same as html_response  
        - Keep it to 1-2 sentences maximum
        - Use 15-30 words for engaging conversation
        - Be sweet, flirty, and girlfriend-like
        - Include appropriate emojis
        - Examples: "Hey babe! 😘 I was just thinking about you.", "You look amazing today! 🔥 Can't wait to see you later."
        - When triggering wallet functions, be supportive: "Sure babe! 😘 Let me connect your wallet for you."
        - NO JSON inside text fields
        - NO separators or formatting marks
        - CLEAN text responses only
        '''
        
        print(web3_prompt)
        conversation_history[conversation_id] = [
            SystemMessage(content=web3_prompt)
        ]

    conversation_history[conversation_id].append(HumanMessage(content=query))

    # Get the response
    result = llm.invoke(conversation_history[conversation_id])
    output_str = result.content
    print(output_str)
    conversation_history[conversation_id].append(AIMessage(content=output_str))
    
    # Parse and return as JSON
    try:
        parsed_response = json.loads(output_str)
        
        # Strip HTML and clean JSON from html_response
        html_response = parsed_response.get("html_response", "")
        clean_html_response = clean_json_from_text(strip_html_tags(html_response))
        
        # Strip HTML and clean JSON from messages text
        messages = parsed_response.get("messages", [])
        clean_messages = []
        for msg in messages:
            clean_msg = msg.copy()
            if "text" in clean_msg:
                cleaned_text = clean_json_from_text(strip_html_tags(clean_msg["text"]))
                clean_msg["text"] = cleaned_text
            clean_messages.append(clean_msg)
        
        # Return in the format expected by useChat hook
        return jsonify({
            "response": {
                "messages": clean_messages,
                "html_response": clean_html_response,
                "function_call": parsed_response.get("function_call", None)
            }
        })
    except json.JSONDecodeError:
        # If parsing fails, return a simple response with HTML stripped and JSON cleaned
        clean_output = clean_json_from_text(strip_html_tags(output_str))
        return jsonify({
            "response": {
                "messages": [{"text": clean_output, "facialExpression": "Talking_0", "animation": "Talking_0"}],
                "html_response": clean_output,
                "function_call": None
            }
        })

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
    