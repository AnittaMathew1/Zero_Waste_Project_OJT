import jwt
from flask import jsonify
from flask import request
from functools import wraps
from flask import abort
from flask import make_response


def login_needed(function):

  @wraps(function)
  def wrap():
        """
        Function to authenticate each API wjich need authentication.
        HS256 algorithm is used for decoding the jwt token
        and the payload is send to each function.
        """
        token=request.headers['Authorization']
        if not token:
            abort(make_response(jsonify(message="Unauthorized"), 401))
        try:
            payload=jwt.decode(token,'secret',algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
          abort(make_response(jsonify(message="Unauthorized"),401))
        return function()

  return wrap