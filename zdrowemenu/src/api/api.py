import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/product/{barcode}")
def getProduct(barcode):
    headers = {"User-Agent": "MyFastAPIApp/1.0"}
    url = f"https://world.openfoodfacts.net/api/v2/product/{barcode}"
    response = requests.get(url, headers = headers)
    return response.json()
