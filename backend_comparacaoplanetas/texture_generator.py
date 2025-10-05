# backend/texture_generator.py

from PIL import Image, ImageEnhance, ImageFilter, ImageChops
import numpy as np
import io
import math
import random

from planetary_client import get_reference_texture

def simple_noise(x, y, scale=100):
    """Gerador de ruído simples usando funções trigonométricas"""
    return (math.sin(x / scale) * math.cos(y / scale) + 
            math.sin(x / scale * 2) * math.cos(y / scale * 2) * 0.5 +
            math.sin(x / scale * 4) * math.cos(y / scale * 4) * 0.25)

def generate_planet_texture(planet_data):
    # --- Parâmetros ---
    size = 512
    
    # 1. Extrai os dados astronômicos, com valores padrão para segurança
    eq_temp_k = planet_data.get("pl_eqt", 288)    # Temp. de equilíbrio em Kelvin
    radius_re = planet_data.get("pl_rade", 1.0)   # Raio em raios da Terra
    star_temp_k = planet_data.get("st_teff", 5778) # Temp. da estrela em Kelvin

    # Converte Kelvin para Celsius para a lógica de temperatura do planeta
    avg_temp_c = eq_temp_k - 273.15

    print("🔹 Recebendo dados:", planet_data)
    print(f"🔹 Temp. Planeta: {eq_temp_k}K ({avg_temp_c:.1f}°C) | Raio: {radius_re} R⊕ | Temp. Estrela: {star_temp_k}K")

    # 2. LÓGICA PRINCIPAL: Decide o tipo de planeta com base na temperatura
    if eq_temp_k < 220: # Muito frio -> Planeta Gelado
        terrain = "ice"
        water_level = 0.0 # Sem água líquida, tudo congelado
        print("➡️ Planeta classificado como: GELADO")
    elif 220 <= eq_temp_k < 370: # Temperado -> Pode ter água líquida
        terrain = "vegetation"
        water_level = 0.45 # Nível do mar padrão
        print("➡️ Planeta classificado como: TEMPERADO (potencialmente habitável)")
    else: # Muito quente -> Planeta Desértico
        terrain = "desert"
        water_level = 0.0 # Sem água líquida, tudo evaporado
        print("➡️ Planeta classificado como: DESÉRTICO/QUENTE")

    # 3. Busca a imagem de referência para o bioma decidido
    try:
        detail_texture = get_reference_texture(terrain)
        detail_array = np.array(detail_texture.resize((size, size)))
    except Exception as e:
        print(f"⚠️ Falha ao buscar textura de referência para '{terrain}': {e}. Usando fallback.")
        fallback_colors = {"ice": (200, 200, 220), "vegetation": (80, 120, 80), "desert": (180, 140, 100)}
        detail_texture = Image.new("RGB", (size, size), color=fallback_colors.get(terrain))
        detail_array = np.array(detail_texture)

    # 4. Gera o mapa de continentes, influenciado pelo raio do planeta
    world = np.zeros((size, size))
    # Planetas maiores (maior gravidade) podem ter continentes mais "suaves"
    # Modificamos a escala do ruído com base no raio
    noise_scale_modifier = 1.0 / max(0.8, min(radius_re, 1.5)) # Limita o efeito
    base_scale = 80 * noise_scale_modifier
    
    random.seed(hash(str(planet_data))) # Semente baseada nos dados para consistência

    for i in range(size):
        for j in range(size):
            noise_val = (simple_noise(i, j, base_scale) + 
                         simple_noise(i, j, base_scale / 2) * 0.5 + 
                         simple_noise(i, j, base_scale / 4) * 0.25 +
                         random.uniform(-0.1, 0.1))
            world[i][j] = noise_val

    world = (world - np.min(world)) / (np.max(world) - np.min(world))

    # 5. Pinta o planeta com base no mapa de altura e bioma
    deep_water = (5, 25, 80)
    shallow_water = (25, 90, 150)
    mountains = (140, 140, 140)
    ice_color = (230, 235, 240)

    color_map = np.zeros((size, size, 3), dtype=np.uint8)
    for i in range(size):
        for j in range(size):
            h = world[i][j]
            if terrain == "ice":
                # Em um mundo de gelo, a altura define rachaduras ou elevações
                base_ice = np.array(ice_color, dtype=np.float32)
                color_map[i][j] = (base_ice * (0.8 + h * 0.2)).astype(np.uint8)
            else:
                if h < water_level:
                    color_map[i][j] = deep_water
                elif h < water_level + 0.05:
                    color_map[i][j] = shallow_water
                elif h < 0.85:
                    color_map[i][j] = detail_array[i, j]
                else:
                    color_map[i][j] = mountains

    img = Image.fromarray(color_map, 'RGB')
    
    # 6. Ajuste de cor global baseado na TEMPERATURA DA ESTRELA
    if star_temp_k < 4000: # Estrela fria (Anã Vermelha)
        layer = Image.new('RGB', img.size, (100, 60, 30))
        img = ImageChops.blend(img, layer, 0.25)
        print("🎨 Aplicando filtro de luz de estrela FRIA (avermelhada)")
    elif star_temp_k > 7500: # Estrela quente (Gigante Azul)
        layer = Image.new('RGB', img.size, (180, 200, 255))
        img = ImageChops.blend(img, layer, 0.2)
        print("🎨 Aplicando filtro de luz de estrela QUENTE (azulada)")

    # 7. Toques finais
    img = img.filter(ImageFilter.SMOOTH)
    img = ImageEnhance.Contrast(img).enhance(1.1)

    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    return buffer