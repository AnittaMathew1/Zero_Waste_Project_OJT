import pytest
import requests
import datetime
import jwt
from run import app
from resources.corporation.corporation import get_waste_details
from resources.corporation.corporation import get_ward_details
from resources.corporation.corporation import postCollectionStatus
from resources.corporation.corporation import getSupervisors
from resources.corporation.corporation import postCollectorList
from resources.login.login import postlogin
import json
from requests_mock.mocker import Mocker


def test_url(requests_mock: Mocker):
    responses=requests_mock('http://127.0.0.1:5000/corporation/wastedata')
    
    response=requests.get('http://127.0.0.1:5000/corporation/wastedata')
    print("responsesss",responses)
    assert response.status_code == 500

@pytest.fixture
def jwt_token_generation():
    """
    Function used for generating jwt token for testing purpose
    Algorithm used is HS256 for encoding payload into jwt token
    """
    payload = {
                    'id':'4',
                    'exp':datetime.datetime.utcnow()+datetime.timedelta(minutes = 60),
                    'iat':datetime.datetime.utcnow()
                    
                }
    token = jwt.encode(payload, 'secret', algorithm = 'HS256')
    return(token)
def test_waste_data():
  
    """
    This function is used for testing the API for getting
    waste details from waste table.

    """
    with app.test_client() as test_client:
        
        response = test_client.get('/corporation/wastedata')
        assert response.status_code == 200


@pytest.fixture
def test_collectionStatusUpdate(requests_mock: Mocker):
    headers={'Authorization':jwt_token_generation}
    Params={
            'status':'Collected',
            'wardno':1,
            'collection_date':'2023-01-09'}
    url='/corporation/collectionstatusupdate'

def test_ward_data():

    """
    This function is used for testing the API for getting 
    ward details from waste table
    
    """
    with app.test_client() as test_client:
        response = test_client.get('/corporation/warddata')
        assert response.status_code == 200

def test_getsupervisor_successful(jwt_token_generation):
    """
    Function used for testing API for getting supervisor list by corporation employees

    """
    headers={'Authorization':jwt_token_generation}
    url='corporation/supervisorlist'
    with app.test_client() as test_client:
        response = test_client.post(url,headers=headers)
    assert response.status_code == 200

def test_getcollectorlist_successful(jwt_token_generation):
    """
    Function used for testing API for getting collector list by corporation employees
    """
    headers={'Authorization':jwt_token_generation}
    Params={'wardno':1}
    url='/corporation/collectorlist'
    with app.test_client() as test_client:
        response = test_client.post(url, data=json.dumps(Params),headers=headers)
    assert response.status_code == 200

def test_CollectionStatus_successful(jwt_token_generation):
    """
    Function for testing API for getting collection status by corporation employees

    """
    headers={'Authorization':jwt_token_generation}
    url='/corporation/collectionstatus'
    with app.test_client() as test_client:
        response = test_client.post(url,headers=headers)
    assert response.status_code == 200

def test_paymentReport_successful(jwt_token_generation):
    """
    Function used for testing API for getting payment report by corporation employees
    """
    headers={'Authorization':jwt_token_generation}
    url='/corporation/paymentreport'
    with app.test_client() as test_client:
        response = test_client.get(url,headers=headers)
    assert response.status_code == 200

def test_collectorAllocation_successful(jwt_token_generation):
    """
    Function used for testing API for allocating collector to a perticular ward by corporation employees
    """
    headers={'Authorization':jwt_token_generation}
    Params={'wardno':1,
            'supervisor_id':4,
            'collection_date':'2023-01-09',
            'status':'Collector Allocated'
            }
    url='/corporation/paymentreport'
    with app.test_client() as test_client:
        response = test_client.get(url,data=json.dumps(Params),headers=headers)
    assert response.status_code == 200

def test_wasteReport_successful(jwt_token_generation):
    """
    Function used for testing API for getting waste report
    """
    headers={'Authorization':jwt_token_generation}
    Params={'wasteid':1}
    url='/corporation/wastereport'
    with app.test_client() as test_client:
        response = test_client.post(url,data=json.dumps(Params),headers=headers)
    assert response.status_code == 200


def test_collectionStatusUpdate_successful():
    """
    Function used for testing API for updating collection status by supervisor
    
    """
    headers={'Authorization':jwt_token_generation}
    Params={
            'status':'Collected',
            'wardno':1,
            'collection_date':'2023-01-09'}
    url='/corporation/collectionstatusupdate'
    with app.test_client() as test_client:
        response = test_client.post(url,data=json.dumps(Params),headers=headers)
    assert response.status_code == 200

