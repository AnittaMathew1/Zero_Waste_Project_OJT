import pytest
from run import app
import datetime
import jwt
from resources.login.login import postlogin
import json

def test_login_successful():
    """
    Function used for testing API for login by both house owner and corporation employees
    """
    Params={'email':'anittaaa@gmail.comm',
            'password':'anitta@123'}
    url='/login/'
    with app.test_client() as test_client:
        response = test_client.post(url, data=json.dumps(Params))
    assert response.status_code == 200