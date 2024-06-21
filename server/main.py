from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.security import HTTPBasic, HTTPBasicCredentials, HTTPAuthorizationCredentials, HTTPBearer

from fastapi_limiter import FastAPILimiter
from fastapi_limiter.depends import RateLimiter

from generate_img_module import generate_img

from pydantic import BaseModel

from generate_img_module import MODELS

from db import get_db, add_image, get_all_images

import asyncio

from os import getenv

API_KEY = getenv('API_KEY')
# API_KEY = 'a'

app = FastAPI()

origins = [
    "*",
]

# Разрешить все источники
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImageParams(BaseModel):
    prompt: str
    negative_prompt: str
    model: str

# import base64

# lock = asyncio.Semaphore()

from time import sleep

# counter = 0

security = HTTPBearer(scheme_name='Authorization')

@app.post('/generate-image', summary='Generate image', description='Generate image by prompt, negative prompt and model')
def generate_image_endpoint(params: ImageParams, api_key: HTTPAuthorizationCredentials = Depends(security), db=Depends(get_db)):
    api_key = api_key.credentials
    if api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")

    # global counter

    print('Получил')

    if not params.model in MODELS:
        raise HTTPException(status_code=400, detail="Model not found")
    print('начал обрабатывать src')
    src = generate_img(params.prompt, params.negative_prompt, params.model, 'img')
    # counter += 1
    # print('src')

    add_image(src, params.prompt, params.negative_prompt, params.model, db)

    return src

    # sleep(0.5)

    # return FileResponse(path=src, filename=src)

    # with open(src, 'rb') as image_file:
    #     encoded_string = base64.b64encode(image_file.read())

    #     encoded_string = encoded_string.decode('utf-8')

    # add_image(encoded_string, params.prompt, params.negative_prompt, params.model, db)

    # return encoded_string

    # async with lock:

    #     print('Получил')

    #     if not params.model in MODELS:
    #         raise HTTPException(status_code=400, detail="Model not found")
    #     print('начал обрабатывать src')
    #     src = await generate_img(params.prompt, params.negative_prompt, params.model)
    #     print('src')

    #     # sleep(0.5)

    #     return FileResponse(path=src, filename=src)

    #     with open(src, 'rb') as image_file:
    #         encoded_string = base64.b64encode(image_file.read())

    #         encoded_string = encoded_string.decode('utf-8')

    #     add_image(encoded_string, params.prompt, params.negative_prompt, params.model, db)

    #     return encoded_string

@app.get('/get-models')
def get_models_endpoint(api_key: HTTPAuthorizationCredentials = Depends(security)):
    api_key = api_key.credentials
    if api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")

    return MODELS

@app.get('/images')
def get_images_endpoint(start: int = 0, length: int = 0, api_key: HTTPAuthorizationCredentials = Depends(security), db=Depends(get_db)):
    api_key = api_key.credentials
    print(api_key)
    if api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")


    images = get_all_images(db)
    # if len(images) == 0:
    #     return []
    # images = images[:5]
    # images = images[:16] + images[18:]
    images = images[::-1]

    if start >= len(images):
        raise HTTPException(status_code=400, detail="Start index out of range")

    if start + length > len(images):
        return images[start:]

    # images = images*5
    if length == 0:
        return images
    return images[start:start+length]
