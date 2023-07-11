import os
import time
import boto3
import requests
from fastapi import FastAPI, UploadFile
from starlette.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


session = boto3.Session(
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
)


origins = [
    "http://localhost:8000",
    "https://yourt-ai.onrender.com",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


s3 = boto3.client("s3")
bucket_name = "yurt-bucket"


os.environ["REPLICATE_API_KEY"] = "r8_QYNslSpqZZqNVAlTEaACp7dldZVvd2Y1cz2og"


@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile):
    file_content = await file.read()

    s3.put_object(Bucket=bucket_name, Key=file.filename, Body=file_content)

    s3_file_url = f"https://{bucket_name}.s3.amazonaws.com/{file.filename}"

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
                "prompt": "realistic render of modern cottage",
                "a_prompt": "best quality, extremely detailed, photo from Pinterest, interior, cinematic photo, ultra-detailed, ultra-realistic, award-winning",
                "n_prompt": "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
            },
        },
    )

    startResponseData = startResponse.json()

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
