import os
import time
import boto3
import requests
import json
from fastapi import FastAPI, UploadFile
from dotenv import load_dotenv
from starlette.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional


app = FastAPI()


load_dotenv()


origins = [
    "http://localhost:8000",
    "https://yourt-ai.onrender.com",
    "http://localhost:3000",
    "https://yurt-self.vercel.app",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


s3 = boto3.client("s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name="eu-central-1"
)


bucket_name = "yurt-bucket"


@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile, options: Optional[str] = None):
    file_content = await file.read()

    s3.put_object(Bucket=bucket_name, Key=file.filename, Body=file_content)

    s3_file_url = f"https://{bucket_name}.s3.amazonaws.com/{file.filename}"

    if options:
        style, material, location = options.split(',')[:3] # parse the string into components
        prompt_string = f"{style} {material} {location} realistic render of house"
    else:
        prompt_string = "realistic render of house"

    startResponse = requests.post(
        "https://api.replicate.com/v1/predictions",
        headers={
            "Content-Type": "application/json",
            "Authorization": "Token " + os.getenv("REPLICATE_API_KEY"),
        },
        json={
            "version": "854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b",
            "input": {
                "image": s3_file_url,
                "prompt": prompt_string,
                #"a_prompt": "best quality, extremely detailed,  interior, cinematic photo, ultra-detailed, ultra-realistic, award-winning, city background, urban, skyscrapers",
                "n_prompt": "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, trees, text",
            },
        },
    )

    startResponseData = startResponse.json()
    print(startResponseData)
    endpointUrl = startResponseData["urls"]["get"]

    restoredImage = None
    while not restoredImage:
        print("polling for result...")
        finalResponse = requests.get(
            endpointUrl,
            headers={
                "Content-Type": "application/json",
                "Authorization": "Token " + os.getenv("REPLICATE_API_KEY"),
            },
        )
        finalResponseData = finalResponse.json()

        if finalResponseData["status"] == "succeeded":
            restoredImage = finalResponseData["output"]
        elif finalResponseData["status"] == "failed":
            break
        else:
            time.sleep(1)

    if restoredImage:
        return JSONResponse(content=restoredImage)
    else:
        return JSONResponse(content="Failed to restore image")
