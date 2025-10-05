# backend/planetary_client.py
import requests
from PIL import Image
from io import BytesIO
import os
import random
# A biblioteca planetary_computer ainda é útil para assinar os links
import planetary_computer

# --- Configuração ---
CACHE_DIR = "texture_cache"
if not os.path.exists(CACHE_DIR):
    os.makedirs(CACHE_DIR)

BBOX_OPTIONS = {
    "ice": [-50, 70, -40, 80],
    "desert": [20, 15, 30, 25],
    "vegetation": [-60, -10, -50, 0],
    "ocean": [-30, -30, -20, -20],
}

def get_reference_texture(terrain_type="vegetation"):
    """
    Busca uma imagem de referência do Planetary Computer usando uma chamada direta de API
    para garantir robustez, e implementa um sistema de cache.
    """
    cache_path = os.path.join(CACHE_DIR, f"{terrain_type}_reference.png")

    # 1. Tenta carregar do cache primeiro
    if os.path.exists(cache_path):
        print(f"✅ Carregando '{terrain_type}' do cache.")
        return Image.open(cache_path)

    # 2. Se não estiver no cache, faz a busca direta via API
    print(f"📡 Buscando '{terrain_type}' diretamente na API do Planetary Computer...")
    search_url = "https://planetarycomputer.microsoft.com/api/stac/v1/search"
    
    payload = {
        "collections": ["sentinel-2-l2a"],
        "bbox": BBOX_OPTIONS.get(terrain_type, [-10, -10, 10, 10]),
        "limit": 5
    }

    try:
        # Faz a requisição da busca
        response_search = requests.post(search_url, json=payload, timeout=30)
        response_search.raise_for_status()
        search_data = response_search.json()

        features = search_data.get("features")
        if not features:
            raise Exception("A busca funcionou, mas não retornou nenhuma imagem (features).")

        # Pega um item aleatório dos resultados e encontra o link da imagem
        random_item = random.choice(features)
        asset_href = random_item["assets"]["visual"]["href"]
        
        # Assina o URL para poder baixar a imagem
        signed_href = planetary_computer.sign(asset_href)
        
        # Baixa a imagem
        response_image = requests.get(signed_href, timeout=30)
        response_image.raise_for_status()

        img = Image.open(BytesIO(response_image.content)).convert("RGB")
        img = img.resize((512, 512))

        # Salva no cache para a próxima vez
        img.save(cache_path)
        print(f"💾 Imagem para '{terrain_type}' baixada e salva no cache.")
        
        return img

    except Exception as e:
        print(f"❌ ERRO CRÍTICO durante a busca/download: {e}")
        # Retorna uma imagem cinza genérica em caso de falha
        return Image.new("RGB", (512, 512), color="#333")