from flask_mail import Message
import secrets
import jwt
from flask import jsonify
from flask import abort
import datetime
from flask import request
from werkzeug.security import generate_password_hash
import resources.db_helper.helperfile as helperfile
from resources.zerowaste_mailing.config import mail
from resources.routes.routes import zerowastemailcontroller

@zerowastemailcontroller.route('/forgot_password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    conn = helperfile.get_db_connection()
    if conn:
        cur = conn.cursor()
        cur.execute("SELECT userid FROM login WHERE email='{}'".format(email))
        id = cur.fetchone()[0]
        if id:
            payload = {
                        'email': email,
                        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=5),
                        'iat': datetime.datetime.utcnow()
                    }
            token = jwt.encode(payload, 'secret', algorithm='HS256')
            message = Message('Password Reset' ,recipients=[email])
            message.body = f'Click this link to reset your password: http://localhost:3000/resetpassword?token={token}'
            mail.send(message)
            return jsonify(message="Email sent Successfully",status=200)
        else:
            return jsonify(errorMessage= "No user found", status=401)
    else:
        abort(500, "Internal Server Error: CONNECTION FAILED")

@zerowastemailcontroller.route('/reset_password', methods=['GET', 'POST'])
def reset_password():
    token = request.headers['Authorization']
    try:
            payload=jwt.decode(token,'secret',algorithms = ['HS256'])
            email = payload['email']
            conn = helperfile.get_db_connection()
            if conn:
                cur = conn.cursor()
                data = request.get_json()
                password = generate_password_hash(data.get('password'), method='sha256')
                cur.execute("UPDATE login SET password='{0}' WHERE email='{1}'".format(password,email))

                return jsonify(message="Password reset successfully",status=200)
            else:
                abort(500, "Internal Server Error: CONNECTION FAILED")

    except jwt.ExpiredSignatureError:
            
            return jsonify(status=500,errorMessage="Link Expired")
