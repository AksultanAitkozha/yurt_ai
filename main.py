import os
import time
import boto3
import requests
from fastapi import FastAPI, UploadFile, File
from starlette.responses import JSONResponse

app = FastAPI()

s3 = boto3.client("s3")
bucket_name = "yurt-bucket"  # replace with your bucket name


os.environ["REPLICATE_API_KEY"] = "r8_QYNslSpqZZqNVAlTEaACp7dldZVvd2Y1cz2og"


@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile):
    # Step 1: User uploads the file to your server
    file_content = await file.read()

    # Step 2: Your server sends the file to Amazon S3 and stores it
    s3.put_object(Bucket=bucket_name, Key=file.filename, Body=file_content)

    # Step 3: Your server retrieves a publicly accessible URL to the file
    s3_file_url = f"https://{bucket_name}.s3.amazonaws.com/{file.filename}"


    # Step 4: Your server sends this URL to the Replicate model
    # POST request to Replicate to start the image restoration generation process
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

    # GET request to get the status of the image restoration process & return the result when it's ready
    restoredImage = None
    while not restoredImage:
        # Loop in 1s intervals until the alt text is ready
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
