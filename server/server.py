import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import cv2
from io import BytesIO
import base64
from PIL import Image

app = Flask(__name__)
CORS(app)

# Load the pre-trained model
model_path = os.path.join('models', 'rgb_oct.h5')
model = tf.keras.models.load_model(model_path)

# Preprocess the image
def preprocess_image(image_data):
    # Decode the base64 image data
    img = Image.open(BytesIO(base64.b64decode(image_data)))
    img = np.array(img)
    img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    img = cv2.resize(img, (224, 224))  # Resize to the input size expected by the model
    img = img / 255.0  # Normalize pixel values to [0, 1]
    img = np.expand_dims(img, axis=0)  # Add batch dimension
    return img

# Define hairstyle recommendations based on face shape and gender
hairstyle_recommendations = {
    'Heart': {
        'male': ['Short Quiff', 'Textured Crop', 'Buzz Cut'],
        'female': ['Side Parted Bob', 'Layered Waves', 'Pixie Cut']
    },
    'Oblong': {
        'male': ['Medium Pompadour', 'Slick Back', 'Crew Cut'],
        'female': ['Long Layers', 'Soft Curls', 'Feathered Bangs']
    },
    'Oval': {
        'male': ['Fade with Pompadour', 'Undercut', 'Side Part'],
        'female': ['Blunt Bob', 'Long Sleek Hair', 'Messy Waves']
    },
    'Round': {
        'male': ['High Fade with Pompadour', 'Fringe', 'Spiky Hair'],
        'female': ['Asymmetrical Bob', 'Layered Shag', 'Side Swept Bangs']
    },
    'Square': {
        'male': ['Short Crew Cut', 'Caesar Cut', 'Textured Quiff'],
        'female': ['Soft Layered Waves', 'Side Part', 'Textured Lob']
    }
}

# Define route to handle image prediction and hairstyle recommendations
@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    img_data = data.get('image')
    gender = data.get('gender')

    # Check if image data and gender are provided
    if not img_data or not gender:
        return jsonify({"error": "Image or gender data missing"}), 400

    # Preprocess the image
    preprocessed_image = preprocess_image(img_data)

    # Make a prediction using the model
    predictions = model.predict(preprocessed_image)
    predicted_class = np.argmax(predictions, axis=1)[0]

    # Get the predicted face shape from the model
    shape_types = ['Heart', 'Oblong', 'Oval', 'Round', 'Square']
    predicted_label = shape_types[predicted_class]

    # Fetch hairstyle recommendations based on the face shape and gender
    recommended_hairstyles = hairstyle_recommendations[predicted_label][gender]

    # Return the predicted face shape and recommended hairstyles
    response = {
        "face_shape": predicted_label,
        "hairstyles": recommended_hairstyles
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
