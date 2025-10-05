# backend_modelo/predict.py
import sys
import json
import requests
import os
from google.oauth2.service_account import Credentials
from google.auth.transport.requests import Request

def predict_exoplanet(input_data):
    try:
        # --- Configurações com caminho absoluto ---
        PROJECT_ID   = "nasa-exoplanetas"
        REGION       = "us-central1"
        ENDPOINT_ID  = "2905308843305074688"
        
        # Usar caminho absoluto para o arquivo de credenciais
        script_dir = os.path.dirname(os.path.abspath(__file__))
        KEY_PATH = os.path.join(script_dir, "vertex-sa.json")
        
        print(f"=== DEBUG PATHS ===", file=sys.stderr)
        print(f"Script dir: {script_dir}", file=sys.stderr)
        print(f"Key path: {KEY_PATH}", file=sys.stderr)
        print(f"Key exists: {os.path.exists(KEY_PATH)}", file=sys.stderr)
        
        # Verificar se o arquivo existe
        if not os.path.exists(KEY_PATH):
            raise FileNotFoundError(f"Arquivo vertex-sa.json não encontrado em {KEY_PATH}")
        
        # 1) Pega access token
        scopes = ["https://www.googleapis.com/auth/cloud-platform"]
        creds = Credentials.from_service_account_file(KEY_PATH, scopes=scopes)
        creds.refresh(Request())
        token = creds.token

        # 2) Monta URL
        url = (
            f"https://{REGION}-prediction-aiplatform.googleapis.com/"
            f"v1/projects/{PROJECT_ID}/locations/{REGION}/endpoints/{ENDPOINT_ID}:predict"
        )

        # 3) Payload
        payload = {
            "instances": [
                {
                    "domain": "koi",
                    "features": {
                        "pl_orbper": float(input_data.get("pl_orbper", 0)),
                        "pl_trandurh": float(input_data.get("pl_trandurh", 0)),
                        "pl_trandep": float(input_data.get("pl_trandep", 0)),
                        "pl_rade": float(input_data.get("pl_rade", 0)),
                        "pl_insol": float(input_data.get("pl_insol", 0)),
                        "pl_eqt": float(input_data.get("pl_eqt", 0)),
                        "st_teff": float(input_data.get("st_teff", 0)),
                        "st_logg": float(input_data.get("st_logg", 0))
                    }
                }
            ]
        }

        # 4) Chamada HTTP
        headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        r = requests.post(url, headers=headers, json=payload, timeout=30)
        
        print(f"HTTP {r.status_code}", file=sys.stderr)
        print(f"Response: {r.text}", file=sys.stderr)
        
        r.raise_for_status()
        
        # 5) Processar resposta
        result = r.json()
        predictions = result.get("predictions", [])
        
        if predictions:
            prediction = predictions[0]
            
            label = int(prediction.get("label", 0))
            confidence = float(prediction.get("p_domain", 0.0))
            threshold = float(prediction.get("threshold", 0.5))
            domain = prediction.get("domain", "koi")
                
            return {
                "label": label,
                "confidence": confidence,
                "threshold": threshold,
                "domain": domain,
                "raw_prediction": prediction
            }
        else:
            return {
                "label": 0,
                "confidence": 0.0,
                "error": "Nenhuma predição retornada"
            }
            
    except Exception as e:
        print(f"Erro interno: {str(e)}", file=sys.stderr)
        return {
            "label": 0,
            "confidence": 0.0,
            "error": str(e)
        }

if __name__ == "__main__":
    try:
        if len(sys.argv) < 2:
            test_data = {
                "pl_orbper": 0.5,
                "pl_trandurh": 0.8,
                "pl_trandep": 0.3,
                "pl_rade": 0.9,
                "pl_insol": 0.1,
                "pl_eqt": 0.2,
                "st_teff": 0.3,
                "st_logg": 0.4
            }
            input_data = test_data
        else:
            if sys.argv[1].endswith('.json'):
                with open(sys.argv[1], 'r') as f:
                    input_data = json.load(f)
            else:
                input_json = sys.argv[1]
                input_data = json.loads(input_json)
        
        result = predict_exoplanet(input_data)
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {
            "label": 0,
            "confidence": 0.0,
            "error": str(e)
        }
        print(json.dumps(error_result))