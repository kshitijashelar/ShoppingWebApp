from flask import Flask, request
import requests
app = Flask(__name__, static_folder='static', static_url_path='')
# Serving cart.html as a route to avoid cors restrictions on client side


@app.route("/")
def root():
    return app.send_static_file("cart.html")
# api for fetching basket scores


@app.route("/basketScore", methods=["POST"])
def basketScore():
    body = request.json
    result = requests.post(
        "https://beta-api.evocco.com/basket-score", json=body)
    return result.json(), result.status_code


if __name__ == "__main__":

    app.run()
