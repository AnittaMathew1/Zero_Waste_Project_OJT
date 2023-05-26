
from flask import Flask
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
import resources.corporation.corporation
import resources.house_owner.house_owner
from resources.routes.routes import register
from resources.login.login import post_login
import resources.zerowaste_mailing.mail
register(app)
