import os
import base64
import numpy as np
import cv2
import tensorflow as tf
from flask import Flask, request, jsonify, send_file  
from flask_cors import CORS
from io import BytesIO
from PIL import Image
from typing import Dict, List, Union
from gradio_client import Client, file 

# === CONFIGURATION === #
FACE_CASCADE=cv2.CascadeClassifier(os.path.join('models',"haarcascade_frontalface_default.xml"))
MODEL_PATH = os.path.join('models', 'rgb_oct.h5')
FACE_SHAPES = ['Heart', 'Oblong', 'Oval', 'Round', 'Square']
HAIR_TRANSFER_CLIENT = Client("AIRI-Institute/HairFastGAN")
TEMP_DIR = "./temp"

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Ensure temp directory exists
os.makedirs(TEMP_DIR, exist_ok=True) 

# Load the model
model = tf.keras.models.load_model(MODEL_PATH)

# === HELPER FUNCTIONS === #
def no_of_faces(image_data):
    img = Image.open(BytesIO(base64.b64decode(image_data)))
    gray = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2GRAY)
    faces = FACE_CASCADE.detectMultiScale(gray,1.1,4)
    print(len(faces))

def preprocess_image(image_data: str) -> np.ndarray:
    """Decode, preprocess, and prepare the image for model input."""
    try:
        img = Image.open(BytesIO(base64.b64decode(image_data)))
        img = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
        img = cv2.resize(img, (224, 224)) / 255.0  # Normalize to [0, 1]
        return np.expand_dims(img, axis=0)  # Add batch dimension
    except Exception as e:
        raise ValueError(f"Image preprocessing failed: {e}")

def get_recommendations(data: Dict[str, Dict[str, List[str]]], shape: str, gender: str) -> List[str]:
    """Fetch recommendations based on face shape and gender."""
    return data.get(shape, {}).get(gender, [])

def predict_face_shape(image_data: str) -> str:
    """Predict the face shape using the pre-trained model."""
    preprocessed_image = preprocess_image(image_data)
    predictions = model.predict(preprocessed_image)
    return FACE_SHAPES[np.argmax(predictions)]

def save_and_resize_image(file, filename: str) -> str:
    """Save and resize the uploaded image to 1024x1024 and return its path."""
    try:
        # Define the path inside the temp/ directory
        filepath = os.path.join(TEMP_DIR, filename)

        # Save the original file temporarily
        file.save(filepath)

        # Open and resize the image to 1024x1024
        with Image.open(filepath) as img:
            resized_img = img.resize((1024, 1024))
            resized_img.save(filepath)  # Overwrite with the resized version

        return filepath

    except Exception as e:
        raise ValueError(f"Failed to save and resize {filename}: {str(e)}")


# Define hairstyle recommendations based on face shape and gender
hairstyle_recommendations = {
    'Heart': {
        'male': ['Short Quiff', 'Textured Crop', 'Buzz Cut', 'Fringe with Undercut', 'Messy Quiff'],
        'female': ['Side Parted Bob', 'Layered Waves', 'Pixie Cut', 'Textured Bob', 'Half Up-Half Down Hairstyle']
    },
    'Oblong': {
        'male': ['Medium Pompadour', 'Slick Back', 'Crew Cut', 'Man Bun', 'Side Part with Taper Fade'],
        'female': ['Long Layers', 'Soft Curls', 'Feathered Bangs', 'Sleek Long Hair with Middle Parting', 'Wavy Lob']
    },
    'Oval': {
        'male': ['Fade with Pompadour', 'Undercut', 'Side Part', 'Pompadour with Fade', 'Temple Fade with Beard'],
        'female': ['Blunt Bob', 'Long Sleek Hair', 'Messy Waves', 'High Ponytail with Voluminous Crown', 'Side Parted Straight Hair']
    },
    'Round': {
        'male': ['High Fade with Pompadour', 'Fringe', 'Spiky Hair', 'Short Spikes', 'Classic Undercut'],
        'female': ['Asymmetrical Bob', 'Layered Shag', 'Side Swept Bangs', 'Layered Cut with Curls', 'Braided Bun (Judha)']
    },
    'Square': {
        'male': ['Short Crew Cut', 'Caesar Cut', 'Textured Quiff', 'Top Knot', 'Side Part'],
        'female': ['Soft Layered Waves', 'Side Parts', 'Textured Lob', 'Loose Curls with Highlights', 'Feather Cut']
    }
}

# Full Frame Style Recommendations
frame_recommendations = {
    'Heart': {
        'male': ['Aviator', 'Hexagonal', 'Browline', 'Round'],
        'female': ['Cat-Eye', 'Soft Curves', 'Hexagonal', 'Oversized']
    },
    'Oblong': {
        'male': ['Rectangular', 'Aviator', 'Octagonal', 'Square'],
        'female': ['Oversized', 'Rectangular', 'Octagonal']
    },
    'Oval': {
        'male': ['Aviator', 'Hexagonal', 'Round', 'Square'],
        'female': ['Soft Curves', 'Oversized', 'Round', 'Browline']
    },
    'Round': {
        'male': ['Square', 'Rectangular', 'Hexagonal', 'Browline'],
        'female': ['Cat-Eye', 'Rectangular', 'Square']
    },
    'Square': {
        'male': ['Aviator', 'Octagonal', 'Round'],
        'female': ['Oversized', 'Round', 'Hexagonal']
    }
}


# === ROUTES === #

@app.route('/hair-transfer', methods=['POST'])
def hair_transfer():
    """Handle hair transfer using two images: user image and reference image."""
    if 'userImage' not in request.files or 'referenceImage' not in request.files:
        return jsonify({"error": "Both userImage and referenceImage are required."}), 400

    try:
        # Save and resize the uploaded images to temp directory
        user_path = save_and_resize_image(request.files['userImage'], "user.png")
        ref_path = save_and_resize_image(request.files['referenceImage'], "reference.png")

        # Make the API call to HairFastGAN with the saved images
        result = HAIR_TRANSFER_CLIENT.predict(
            face=file(user_path),
            shape=file(ref_path),
            color=None,  # Optional: Add color images if needed
            blending="Article",
            poisson_iters=0,
            poisson_erosion=15,
            api_name="/swap_hair"
        )

        # Check if the response contains the generated image path
        if not result or 'value' not in result[0]:
            return jsonify({"error": "Failed to generate the hairstyle. Please check input images."}), 500

        generated_path = result[0]['value']

        # Return the generated image
        return send_file(generated_path, mimetype='image/png')

    except Exception as e:
        print(f"Error during hair transfer: {str(e)}")  # Log for debugging
        return jsonify({"error": f"Hair transfer failed: {str(e)}"}), 500

    finally:
        # Cleanup: Delete the temporary files after processing
        for path in [user_path, ref_path]:
            if os.path.exists(path):
                os.remove(path)

            
@app.route('/frame-recommend', methods=['POST'])
def recommend_frame():
    """Recommend suitable frames based on the face shape and gender."""
    try:
        data = request.get_json()
        image_data = data.get('image')
        gender = data.get('gender')

        if not image_data or not gender:
            return jsonify({"error": "Image or gender data missing"}), 400

        predicted_shape = predict_face_shape(image_data)
        frames = get_recommendations(frame_recommendations, predicted_shape, gender)

        return jsonify({"face_shape": predicted_shape, "frames": frames})

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/face-shape', methods=['POST'])
def detect_face_shape():
    """Detect face shape from the uploaded image."""
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image_file = request.files['image']
    if not image_file.filename:
        return jsonify({"error": "Empty filename provided"}), 400

    try:
        img_bytes = image_file.read()
        img_data = base64.b64encode(img_bytes).decode('utf-8')
        no_of_faces(img_data)
        predicted_shape = predict_face_shape(img_data)

        return jsonify({"face_shape": predicted_shape})

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/recommend', methods=['POST'])
def recommend():
    """Recommend hairstyles based on the face shape and gender."""
    data = request.get_json()
    image_data = data.get('image')
    gender = data.get('gender')

    if not image_data or not gender:
        return jsonify({"error": "Image or gender data missing"}), 400

    try:
        predicted_shape = predict_face_shape(image_data)
        hairstyles = get_recommendations(hairstyle_recommendations, predicted_shape, gender)

        return jsonify({"face_shape": predicted_shape, "hairstyles": hairstyles})

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

# === MAIN ENTRY POINT === #
if __name__ == '__main__':
    app.run(debug=True)