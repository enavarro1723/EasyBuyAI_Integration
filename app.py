from flask import Flask, request, jsonify,render_template
import requests
import settings

app = Flask(__name__)


# Consulta por servicio EasyBuyAI
@app.route('/send_request', methods=['POST'])
def send_request():
    # Obtener los datos del cuerpo de la solicitud
    data = request.json

    # Verificar si se han recibido datos
    if not data:
        return jsonify({'error': 'No se proporcionaron datos en la solicitud'}), 400

    # Configurar los datos para enviar la solicitud a RapidAPI
    rapidapi_url = 'https://easybuyai.p.rapidapi.com/BestProduct/'
    headers = {
        'X-RapidAPI-Host': 'easybuyai.p.rapidapi.com',
        'X-RapidAPI-Key': settings.RAPIDAPI_KEY,
        'Content-Type': 'application/json'
    }

    # Realizar la solicitud a RapidAPI
    try:
        response = requests.post(rapidapi_url, json=data, headers=headers)
        rapidapi_data = response.json()
        return jsonify(rapidapi_data)
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Error al enviar la solicitud a RapidAPI: {str(e)}'}), 500

@app.route('/', methods=['GET'])
def home():
    return render_template("index.html")


if __name__ == '__main__':
    app.run(debug=True)
