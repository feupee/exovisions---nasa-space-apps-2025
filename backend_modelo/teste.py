# call_vertex.py
import os, json, requests
from google.oauth2.service_account import Credentials
from google.auth.transport.requests import Request

PROJECT_ID  = os.getenv("PROJECT_ID", "nasa-exoplanetas")
REGION      = os.getenv("REGION", "us-central1")
ENDPOINT_ID = os.getenv("ENDPOINT_ID", "807757316857266176")
KEY_PATH    = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "vertex-sa.json")

def get_token():
    scopes = ["https://www.googleapis.com/auth/cloud-platform"]
    creds = Credentials.from_service_account_file(KEY_PATH, scopes=scopes)
    creds.refresh(Request())
    return creds.token

def main():
    url = (f"https://{REGION}-prediction-aiplatform.googleapis.com/"
           f"v1/projects/{PROJECT_ID}/locations/{REGION}/endpoints/{ENDPOINT_ID}:rawPredict")

   
    payload = {
        "domains": {
            "koi": "gs://nasa-exoplanets/koi",
            "toi": "gs://nasa-exoplanets/toi",
            "k2":  "gs://nasa-exoplanets/k2"
        },
        "final_dir": "gs://nasa-exoplanets/final_vote3",
        "instances": [
            {
                "domain": "toi",
                "features": {
                    "pl_orbper": 2.536574759533856,
                    "pl_trandurh": 0.2832283286611862,
                    "pl_trandep": -0.3162138699763263,
                    "pl_rade": -0.047769519708395,
                    "pl_insol": -0.046548220806706,
                    "pl_eqt": -0.2415042327238253
                }
            }
        ]
    }

    token = get_token()
    r = requests.post(url, headers={
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }, json=payload, timeout=120)

    print("HTTP", r.status_code)
    try:
        print(json.dumps(r.json(), indent=2, ensure_ascii=False))
    except Exception:
        print(r.text)
    r.raise_for_status()

if __name__ == "__main__":
    main()
