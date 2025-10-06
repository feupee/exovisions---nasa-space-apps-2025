# backend_modelo/predict.py
import os
import sys
import json
import requests
from google.oauth2.service_account import Credentials
from google.auth.transport.requests import Request

# =========================
# Configurações de ambiente
# =========================
PROJECT_ID  = os.getenv("PROJECT_ID", "nasa-exoplanetas")  # pode manter seu ID do projeto
REGION      = os.getenv("REGION", "us-central1")
ENDPOINT_ID = os.getenv("ENDPOINT_ID", "807757316857266176")

# Caminho do SA: por padrão, usa o vertex-sa.json ao lado deste arquivo.
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
KEY_PATH   = os.getenv("GOOGLE_APPLICATION_CREDENTIALS",
                       os.path.join(SCRIPT_DIR, "vertex-sa.json"))

def get_token() -> str:
    """
    Obtém um access token usando a service account.
    Baseado no seu teste.py.
    """
    scopes = ["https://www.googleapis.com/auth/cloud-platform"]
    creds = Credentials.from_service_account_file(KEY_PATH, scopes=scopes)
    creds.refresh(Request())
    return creds.token

def _choose_model(features: dict) -> tuple[str, str]:
    """
    Decide o tipo de envio (4 casos) e o domínio a usar,
    conforme presença de st_teff e st_logg.
      - 6_fields           -> sem st_teff e sem st_logg  -> domain 'koi'
      - 7_fields_teff      -> com st_teff, sem st_logg    -> domain 'toi'
      - 7_fields_logg      -> sem st_teff, com st_logg    -> domain 'k2'
      - 8_fields           -> com st_teff e com st_logg   -> domain 'toi'
    """
    has_teff = "st_teff" in features and features["st_teff"] is not None
    has_logg = "st_logg" in features and features["st_logg"] is not None

    if not has_teff and not has_logg:
        return "6_fields", "koi"
    if has_teff and not has_logg:
        return "7_fields_teff", "toi"
    if not has_teff and has_logg:
        return "7_fields_logg", "k2"
    return "8_fields", "toi"

def _build_payload(features: dict, domain: str) -> dict:
    """
    Monta o payload conforme seu exemplo, incluindo apenas os campos presentes.
    """
    # Garante que não enviamos chaves opcionais com None
    clean_features = {k: v for k, v in features.items() if v is not None}

    return {
        "domains": {
            "koi": "gs://nasa-exoplanets/koi",
            "toi": "gs://nasa-exoplanets/toi",
            "k2":  "gs://nasa-exoplanets/k2",
        },
        "final_dir": "gs://nasa-exoplanets/final_vote3",
        "instances": [
            {
                "domain": domain,
                "features": clean_features
            }
        ]
    }

def _vertex_url() -> str:
    return (f"https://{REGION}-prediction-aiplatform.googleapis.com/"
            f"v1/projects/{PROJECT_ID}/locations/{REGION}/endpoints/{ENDPOINT_ID}:rawPredict")

def call_vertex_ai(payload: dict) -> dict:
    """
    Faz a requisição ao endpoint do Vertex AI (rawPredict).
    """
    token = get_token()
    r = requests.post(
        _vertex_url(),
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        json=payload,
        timeout=120,
    )
    # Tenta parsear como JSON de qualquer forma para propagar erros úteis
    try:
        data = r.json()
    except Exception:
        data = {"raw_text": r.text}

    # Levanta erro HTTP se não for 2xx (após capturar o corpo)
    r.raise_for_status()
    return data

def predict_exoplanet(props: dict) -> dict:
    """
    Função principal para ser chamada pelo seu handler de API.
    Recebe os dados vindos do page.tsx (features) via props (dict),
    escolhe o tipo correto (4 casos), monta o payload e chama o Vertex.
    """
    # props deve conter os 6 campos obrigatórios e opcionalmente st_teff / st_logg
    # Qualquer um dos opcionais pode estar ausente ou ser None.
    model_type, domain = _choose_model(props)
    payload = _build_payload(props, domain)

    try:
        vertex_resp = call_vertex_ai(payload)
    except Exception as e:
        # Resposta de erro padronizada (útil para o frontend)
        return {
            "error": str(e),
            "model_type": model_type,
            "domain_used": domain,
            "field_count": len({k: v for k, v in props.items() if v is not None}),
        }

    # Acrescenta metadados que o page.tsx usa para exibir info do modelo
    vertex_resp["model_type"] = model_type
    vertex_resp["domain_used"] = domain
    vertex_resp["field_count"] = len({k: v for k, v in props.items() if v is not None})
    return vertex_resp

if __name__ == "__main__":
    # Execução via CLI:
    #   python predict.py '{"pl_orbper":..., "pl_trandurh":..., ..., "st_teff":..., "st_logg":...}'
    if len(sys.argv) > 1:
        try:
            features = json.loads(sys.argv[1])
            result = predict_exoplanet(features)
            print(json.dumps(result, ensure_ascii=False))
        except Exception as e:
            print(json.dumps({"error": str(e)}, ensure_ascii=False))
    else:
        print(json.dumps({"error": "No input data provided"}, ensure_ascii=False))
