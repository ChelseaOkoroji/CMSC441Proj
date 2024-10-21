from cloudinary.uploader import upload
from cloud_config import cloudinary

def upload_image(image_path):
    response = upload(image_path)
    print(f"Image uploaded: {response['secure_url']}")
    return response['secure_url']