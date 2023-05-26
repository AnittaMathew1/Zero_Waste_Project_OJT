from flask import Blueprint


houseownercontroller = Blueprint("houseowner",__name__)     #blueprint for waste
corporationcontroller = Blueprint("corporation",__name__)     #blueprint for ward
logincontroller = Blueprint("login",__name__) 
zerowastemailcontroller = Blueprint("zerowastemailing",__name__) 

def register(app):  

    """
    This function is used for regestering various Blueprints to app

    """
    app.register_blueprint(houseownercontroller, url_prefix='/houseowner')
    app.register_blueprint(corporationcontroller, url_prefix='/corporation')
    app.register_blueprint(logincontroller, url_prefix='/login')
    app.register_blueprint(zerowastemailcontroller, url_prefix='/mailing')