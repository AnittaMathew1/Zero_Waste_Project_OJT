import datetime
import jwt
import json
import pytest
from run import app


@pytest.fixture
def jwt_token_generation():
    """
    Function used for generating jwt token for testing purpose
    Algorithm used is HS256 for encoding payload into jwt token
    """
    payload = {
                    'id':'1',
                    'exp':datetime.datetime.utcnow()+datetime.timedelta(minutes = 60),
                    'iat':datetime.datetime.utcnow()
                    
                }
    token = jwt.encode(payload, 'secret', algorithm = 'HS256')
    return(token)

# def test_registerHouseOwner_successful():
#     """
#     Function used for testing API for house owner registration

#     """
#     url='/houseowner/registerhouseowner'
#     file=open('Zero_Waste\main\tests','r')
#     json_input=file.read()
#     data=json.loads(json_input)
#     with app.test_client() as test_client:
#         response = test_client.post(url,data=data)
#     app.logger.info(response)
#     assert response.status_code == 200

def test_slotBooking_successful(jwt_token_generation):
    """
    Function used for testing the API for slot booking for waste collection by house owner
    """
    headers={'Authorization':jwt_token_generation}
    Params={'waste_id':'Anjusha',
            'booking_date':'2023-01-10',
            'quantity':'6.0'}
    url='/houseowner/slotbooking'
    with app.test_client() as test_client:
        response = test_client.post(url, data=json.dumps(Params),headers=headers)
        app.logger.info(response)
        assert response.status_code == 200

def test_bookingHistory_successful(jwt_token_generation):
    """
    Function used for testing API for getting booking history of waste collection by house owner

    """
    headers={'Authorization':jwt_token_generation}
    url='/houseowner/bookinghistory'
    with app.test_client() as test_client:
        response = test_client.post(url,headers=headers)
        app.logger.info(response)
        assert response.status_code == 200

def test_bookingstatus_successful(jwt_token_generation):
    """
    Function used for testing API for getting booking status of waste collection by house owner

    """
    headers={'Authorization':jwt_token_generation}
    url='/houseowner/bookingstatus'
    with app.test_client() as test_client:
        response = test_client.post(url,headers=headers)
        app.logger.info(response)
        assert response.status_code == 200

def test_billGeneration_successful(jwt_token_generation):
    """
    Function used for testing API for generating bill for payment by house owner

    """
    headers={'Authorization':jwt_token_generation}
    with app.test_client() as test_client:
        url='/houseowner/billgeneration'
        response = test_client.post(url,headers=headers)
        app.logger.info(response)
        assert response.status_code == 200

def test_billPayment_successful(jwt_token_generation):
    """
    Function used for testing API for bill payment by house owner

    """
    headers={'Authorization':jwt_token_generation}
    url='/houseowner/billpayment'
    Params={'paydate':'2023-01-09',
            'grandtotal':'4680.0',
            'email':'anju@gmail.com',
            'status':'1'}
    with app.test_client() as test_client:
        url='/houseowner/billgeneration'
        response = test_client.post(url, data=json.dumps(Params),headers=headers)
        app.logger.info(response)
        assert response.status_code == 200

def test_paymentHistory(jwt_token_generation):
    """
    Function used for testing API for getting payment history by the house owner
    """
    headers={'Authorization':jwt_token_generation}
    with app.test_client() as test_client:
        url='/houseowner/paymenthistory'
        response = test_client.post(url,headers=headers)
        app.logger.info(response)
        assert response.status_code == 200

def test_paymentHistory_unsucessful():
    """
    function to test if API return unsuccessful if the authentication is not done
    """
    with app.test_client() as test_client:
        url='/houseowner/paymenthistory'
        response = test_client.post(url)
        app.logger.info(response)
        assert response.status_code == 500