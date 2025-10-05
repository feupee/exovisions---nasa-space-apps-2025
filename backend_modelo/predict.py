# backend_modelo/predict.py
import sys
import json
import logging

# Configurar logging para stderr (não interfere no stdout JSON)
logging.basicConfig(
    level=logging.INFO,
    format='%(message)s',
    stream=sys.stderr
)

def predict_exoplanet(input_data):
    try:
        models_data = input_data.get("models", [])
        original_data = input_data.get("originalData", {})
        
        # Usar logging.info ao invés de print para logs
        logging.info(f"Executando {len(models_data)} modelos")
        
        results = []
        
        for model_info in models_data:
            model_name = model_info["name"]
            features = model_info["features"]
            field_count = model_info["fieldCount"]
            
            logging.info(f"\n=== EXECUTANDO {model_name.upper()} ({field_count} campos) ===")
            logging.info(f"Features: {json.dumps(features, indent=2)}")
            
            # Configurar endpoint baseado no número de campos
            if field_count == 6:
                endpoint_id = "seu_endpoint_6_campos"
            elif field_count == 7:
                endpoint_id = "seu_endpoint_7_campos"
            elif field_count == 8:
                endpoint_id = "seu_endpoint_8_campos"
            else:
                endpoint_id = "seu_endpoint_ensemble"
            
            # Payload para o modelo específico
            payload = {
                "instances": [
                    {
                        "domain": "koi",
                        "features": features
                    }
                ]
            }
            
            # Simular chamada ao modelo (substitua pela chamada real)
            try:
                # SIMULAÇÃO - substitua pela chamada real
                import random
                simulated_prediction = {
                    "label": random.choice([0, 1]),
                    "confidence": random.uniform(0.6, 0.95),
                    "model": model_name,
                    "field_count": field_count
                }
                
                results.append(simulated_prediction)
                logging.info(f"Resultado {model_name}: {simulated_prediction}")
                
            except Exception as model_error:
                logging.error(f"Erro no modelo {model_name}: {model_error}")
                results.append({
                    "label": 0,
                    "confidence": 0.0,
                    "model": model_name,
                    "field_count": field_count,
                    "error": str(model_error)
                })
        
        # Processar resultados - usar ensemble ou melhor resultado
        best_result = max(results, key=lambda x: x.get("confidence", 0))
        
        final_result = {
            "label": best_result["label"],
            "confidence": best_result["confidence"],
            "best_model": best_result["model"],
            "field_count_used": best_result["field_count"],
            "all_results": results,
            "ensemble_prediction": calculate_ensemble(results)
        }
        
        logging.info(f"\n=== RESULTADO FINAL ===")
        logging.info(json.dumps(final_result, indent=2))
        
        return final_result
        
    except Exception as e:
        logging.error(f"Erro geral: {e}")
        return {
            "label": 0,
            "confidence": 0.0,
            "error": str(e),
            "all_results": []
        }

def calculate_ensemble(results):
    """Calcula predição ensemble dos modelos"""
    if not results:
        return {"label": 0, "confidence": 0.0}
    
    # Média ponderada das confidências
    total_confidence = 0
    total_weight = 0
    positive_votes = 0
    
    for result in results:
        if "error" not in result:
            confidence = result.get("confidence", 0)
            total_confidence += confidence
            total_weight += 1
            if result.get("label", 0) == 1:
                positive_votes += confidence
    
    if total_weight == 0:
        return {"label": 0, "confidence": 0.0}
    
    avg_confidence = total_confidence / total_weight
    vote_ratio = positive_votes / total_confidence if total_confidence > 0 else 0
    
    # Decisão ensemble
    ensemble_label = 1 if vote_ratio > 0.5 else 0
    ensemble_confidence = avg_confidence * (vote_ratio if ensemble_label == 1 else (1 - vote_ratio))
    
    return {
        "label": ensemble_label,
        "confidence": ensemble_confidence,
        "vote_ratio": vote_ratio
    }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        input_json = sys.argv[1]
        input_data = json.loads(input_json)
        result = predict_exoplanet(input_data)
        # APENAS o JSON no stdout
        print(json.dumps(result))
    else:
        # Erro também vai para stderr
        logging.error("No input data provided")
        print(json.dumps({"error": "No input data provided"}))