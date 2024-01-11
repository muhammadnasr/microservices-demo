import os
import random
import json
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
import base64
import paho.mqtt.client as mqtt
from time import time, sleep
from datetime import datetime

# Get environment variables
MQTT_BROKER = os.getenv('MQTT_BROKER_SERVICE_NAME', 'mqtt-service')
IMAGE_GENERATION_INTERVAL_IN_SECONDS = float(os.getenv('IMAGE_GENERATION_INTERVAL_IN_SECONDS', 1.0))
MQTT_IMAGE_TOPIC = os.getenv('MQTT_IMAGE_TOPIC', 1)

# Function to generate a random image
def generate_random_image():
    width, height = 300, 200  # Adjust image dimensions
    color = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))  # Generate a random color
    image = Image.new("RGB", (width, height), color)

    # Draw the current date/time on the image
    draw = ImageDraw.Draw(image)
    font = ImageFont.load_default()  # Load a default font
    timestamp = time()  # Get the current time as a Unix timestamp
    text = datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M:%S')  # Convert the timestamp to a string
    bbox = draw.textbbox((0, 0), text, font)  # Get the bounding box of the text
    textwidth, textheight = bbox[2] - bbox[0], bbox[3] - bbox[1]  # Calculate the width and height of the text
    position = (width//2 - textwidth//2, height//2 - textheight//2)  # Center the text
    draw.text(position, text, fill=(255, 255, 255), font=font)  # Draw the text

    return image, timestamp

# Encode image to Base64/mime type
def encode_image(image):
    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    return "data:image/jpeg;base64," + base64.b64encode(buffered.getvalue()).decode('utf-8')

# Create MQTT client
client = mqtt.Client("image_publisher")
client.connect(MQTT_BROKER)

#keep generating new images every second (or as configured in .env)
while True:
   random_image, timestamp = generate_random_image()
   encoded_image = encode_image(random_image)
   message = {
       'image': encoded_image,
       'metadata': {
           'generatedAt': timestamp,
           'width': random_image.width,
           'height': random_image.height
       }
   }
   json_message = json.dumps(message)
   client.publish(MQTT_IMAGE_TOPIC, json_message)
   sleep(IMAGE_GENERATION_INTERVAL_IN_SECONDS)

# Disconnect from MQTT broker
#client.disconnect()
