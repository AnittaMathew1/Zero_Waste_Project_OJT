from flask import current_app as app
from flask import Response
from flask import request
from flask import jsonify
from flask import abort
import datetime
import jwt
import json
from werkzeug.security import generate_password_hash, check_password_hash
import resources.db_helper.helperfile as helperfile
from resources.routes.routes import logincontroller
from resources.constant.constant import ROLE_SUPERVISOR, ROLE_HOUSEOWNER


@logincontroller.route('/',  methods = ['POST'])
def post_login():
    """
    Function for implimenting login for house owners and corporation employees and generation of jwt token.
    For the jwt token generation HS256 algorithm is used.
    In the payload the userid, the expiry time which is 60 minutes from the time of token generation 
    and also the time at which the token generated are added.
    """
    try:
            data = request.get_json()
            email = data.get('email')
            password = data.get('password')
            app.logger.debug("connection opened")
            conn = helperfile.get_db_connection()
            if conn:
                cur = conn.cursor()
                cur.execute('SELECT userid,password,role_id FROM login WHERE email = %s',[email])
                user = cur.fetchone()
                if user:
                    if user[2] != ROLE_HOUSEOWNER:
                        cur.execute('SELECT id FROM corporation_employee WHERE email = %s',[email])
                        employee_id = cur.fetchone()
                    if not user:
                        return jsonify({'message':'Incorrect Email or Password'}),404
                    else:
                        password_db =(user[1])
                        password_matches = check_password_hash(password_db, password)
                        if not password_matches:
                            return jsonify({'message':'Incorrect Email or Password'}),401
                        else:
                            payload = {
                                'exp':datetime.datetime.utcnow()+datetime.timedelta(minutes = 60),
                                'iat':datetime.datetime.utcnow()
                            }
                        role =user[2]
                        token = jwt.encode(payload, 'secret', algorithm = 'HS256')
                        if role == ROLE_HOUSEOWNER:
                            return jsonify({'token': token, 'role':role ,'userid':user[0] }),200
                        else:
                            return jsonify({'token': token, 'role':role ,'userid':user[0],'employee_id':employee_id }),200
                            
                else:
                    return jsonify({'message':'Incorrect Email or Password'}),401
            else:
                app.logger.error("DB Connection Failed")
                abort(500, "Internal Server Error: CONNECTION FAILED")

            
    except Exception as exceptn:
            app.logger.error(exceptn)
            abort(500, "Internal Server Error")
    finally:
            if conn:
                cur.close()
                conn.close()  #db connection closed
                app.logger.debug("connection closed")

@logincontroller.route('/changepassword',  methods = ['POST'])
def post_change_password():
    """
    Function for Implimenting password change.
    the password is hashed and stored in the db and the method used is 'sha256'
    """
    try:
            data = request.get_json()
            userid = data.get('userid')
            old_password = data.get('old_password')
            new_password = generate_password_hash(data.get('new_password'), method='sha256')
            app.logger.debug("connection opened")
            conn = helperfile.get_db_connection()
            if conn:
                cur = conn.cursor()
                cur.execute('SELECT password FROM login WHERE userid = %s',[userid])
                passwordDB = cur.fetchone()[0]
                password_matches = check_password_hash(passwordDB, old_password)
                if not password_matches:
                    return jsonify({'status':401,'message':'Incorrect Password'})
                else:
                    cur.execute("UPDATE login SET password='{0}' WHERE userid={1}".format(new_password,userid))
                    return jsonify({'message': "Successfully Updated",'status':200 })
            else:
                app.logger.error("DB Connection Failed")
                abort(500, "Internal Server Error: DB Connection Failed")

            
    except Exception as exceptn:
            app.logger.error(exceptn)
            abort(500, "Internal Server Error")
    finally:
            if conn:
                cur.close()
                conn.close()  #db connection closed
                app.logger.debug("connection closed")
