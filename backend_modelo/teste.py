import requests
from google.oauth2.service_account import Credentials
from google.auth.transport.requests import Request

# --- preencha/ajuste se precisar ---
PROJECT_ID   = "nasa-exoplanetas"
REGION       = "us-central1"
ENDPOINT_ID  = "2905308843305074688"
KEY_PATH     = "vertex-sa.json"  # caminho da chave que você criou
# -----------------------------------

# 1) pega um access token curto usando a chave do Service Account
scopes = ["https://www.googleapis.com/auth/cloud-platform"]
creds = Credentials.from_service_account_file(KEY_PATH, scopes=scopes)
creds.refresh(Request())   # emite/renova o token
token = creds.token

# 2) monta a URL do endpoint de predição
url = (
    f"https://{REGION}-prediction-aiplatform.googleapis.com/"
    f"v1/projects/{PROJECT_ID}/locations/{REGION}/endpoints/{ENDPOINT_ID}:predict"
)

# 3) payload mínimo (ajuste nomes das features para o seu feature_names.json)
payload = {
    "instances": [
        {
            "domain": "koi",
            "features": {
                "pl_orbper": 10.5,
                "pl_trandurh": 2.1,
                "pl_trandep": 0.005,
                "pl_rade": 1.2,
                "pl_insol": 800,
                "pl_eqt": 600,
                "st_teff": 0,
                "st_logg": 0
            }
        }
    ]
    # Para fazer a fusão KOI+TOI+K2:
    # , "parameters": {"fuse": True}
}

# 4) chamada HTTP
headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
r = requests.post(url, headers=headers, json=payload, timeout=30)

print("HTTP", r.status_code)
print(r.text)
r.raise_for_status()  # dispara erro se não for 2xx
