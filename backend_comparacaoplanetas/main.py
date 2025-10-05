from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
from texture_generator import generate_planet_texture

app = Flask(__name__)

# ⚙️ CORS configurado corretamente
CORS(app, resources={r"/generate_texture": {"origins": "*"}}, supports_credentials=True)

@app.route("/generate_texture", methods=["POST", "OPTIONS"])
def generate_texture():
    if request.method == "OPTIONS":
        # ✅ Resposta CORS manual para o preflight
        response = jsonify({"status": "OK"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        return response, 200

    # 🔹 POST real
    planet_data = request.get_json()
    print("🔹 Gerando textura para:", planet_data)

    img_buffer = generate_planet_texture(planet_data)
    encoded = base64.b64encode(img_buffer.getvalue()).decode("utf-8")

    response = jsonify({"texture": encoded})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response, 200


@app.route("/")
def index():
    return "✅ Servidor ativo e pronto para gerar texturas!"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
