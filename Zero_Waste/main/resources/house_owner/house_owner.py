from flask import current_app as app
from flask import request
from flask import jsonify
from flask import abort
import inflection
import psycopg2
import psycopg2.extras
import datetime
from werkzeug.security import generate_password_hash
import resources.db_helper.helperfile as helperfile
from resources.routes.routes import houseownercontroller
from resources.auth.Auth import login_needed
from resources.helper_functions.execute_query  import execute_query 
from resources.helper_functions.tuple_to_dict import tuple_to_dict
from resources.constant.constant import STATUS_BOOKED,STATUS_COLLECTED,\
STATUS_NA,ROLE_HOUSEOWNER,PAYMENT_STATUS,DATE_FORMAT,WASTE_PLASTIC,WASTE_EWASTE,WASTE_FOOD,WASTE_METAL,STATUS_PENDING


@houseownercontroller.route('/registerhouseowner',  methods = ['POST'])
def register_houseowner():
    """
    Function for registering new house owner and storing their details into the database
    """
    data = request.get_json()
    role_id = str(ROLE_HOUSEOWNER)
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    email = data.get('email')
    pincode = data.get('pincode')
    phone_no = data.get('phoneno')
    address = data.get('address')
    ward_no = data.get('wardno')
    password = generate_password_hash(data.get('password'), method='sha256')
    try:
            conn = helperfile.get_db_connection()
            if conn:
                    app.logger.debug("DB connection opened")
                    cur = conn.cursor()
                    cur.execute("SELECT id FROM houseowner_data WHERE email='{}'".format(email))
                    user_id_email = cur.fetchone()
                    cur.execute("SELECT id FROM houseowner_data WHERE phoneno='{}'".format(phone_no))
                    user_id_phoneno = cur.fetchone()
                    if user_id_email is None and user_id_phoneno is None:     
                        cur.execute('INSERT INTO houseowner_data(firstname, lastname, email, phoneno, address, pincode, wardno) \
                                    VALUES (%s,%s,%s,%s,%s,%s,%s)RETURNING id',(first_name, last_name, email, phone_no, address, pincode, ward_no))
                        user_id=cur.fetchone()[0]
                        cur.execute('INSERT INTO login (userid,email,password,role_id) \
                                    VALUES (%s,%s,%s,%s)',(user_id, email, password, role_id))
                        
                        return jsonify(message="Successfully Saved"),200
                    elif user_id_email[0]:
                        return jsonify(error_email="Email already exits"),409
                    elif user_id_phoneno[0]:
                        return jsonify(error_phoneno="Phone Number already exits"),409

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


@houseownercontroller.route('/slotbooking',  methods = ['POST'])
@login_needed
def slot_booking():
    """
    Function for booking slot for waste collection.
    the data get from the user is stored in houseowner_slotbooking table and houseowner_bookingstatus table
    """
    
    try:
        data = request.get_json()
        waste_id = data.get('waste_id')
        booking_date = data.get('booking_date')
        quantity = data.get('quantity')
        ho_id = data.get('userid')
        conn = helperfile.get_db_connection()
        if conn:
            app.logger.debug("DB onnection opened")
            sql = ("select ward.supervisor_id, ward.wardno\
                    from ward\
                    inner join houseowner_data on houseowner_data.wardno = ward.wardno\
                    where houseowner_data.id = {0}".format(ho_id))
            ward_data = execute_query (sql)[0]
            cur = conn.cursor()
            cur.execute('INSERT INTO houseowner_slotbooking \
                        (houseowner_id, waste_id, quantity, booking_date, payment_status) \
                        VALUES (%s,%s,%s,%s,%s)RETURNING id',[ho_id, waste_id, quantity, booking_date,PAYMENT_STATUS['UNPAID']])   #insert query
            slot_id=cur.fetchone()[0]
            cur.execute('INSERT INTO houseowner_bookingstatus \
                        (booking_date, status,slot_id,supervisor_id) \
                        VALUES (%s,%s,%s,%s)',(booking_date, STATUS_PENDING,slot_id,ward_data['supervisorId']))
            return jsonify(message="Successfully Saved"),200
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
            app.logger.debug("DB connection closed")
    

@houseownercontroller.route('/bookingstatus',  methods = ['POST'])
@login_needed
def booking_status():
    """
    Function used for showing the booking status of house owners.
    The slots whose status is "pending" are only listed in booking history.
    """
    data = request.get_json()
    ho_id = data.get('userid')
    try:
        conn = helperfile.get_db_connection()
        if conn:
            app.logger.debug("connection opened")
            cur = conn.cursor()
            sql= ("SELECT  houseowner_bookingstatus.id,houseowner_slotbooking.booking_date ,\
                        houseowner_bookingstatus.collection_date,waste.waste_type,houseowner_bookingstatus.status \
                        from houseowner_slotbooking inner join waste on waste.id = houseowner_slotbooking.waste_id \
                        inner join houseowner_bookingstatus on houseowner_slotbooking.id = houseowner_bookingstatus.slot_id \
                        where houseowner_slotbooking.houseowner_id = {0}".format(ho_id))
            cur.execute(sql)
            columns = [inflection.camelize(column[0], False) for column in cur.description]
            result = []
            for row in cur.fetchall():
                result.append(dict(zip(columns, row)))
            final_list=[]
            cur.execute("""SELECT CONCAT(corporation_employee.firstname, ' ', corporation_employee.lastname) AS fullName
                            FROM corporation_employee 
                            INNER JOIN ward ON corporation_employee.id=ward.supervisor_id
                            INNER JOIN houseowner_data ON ward.wardno=houseowner_data.wardno
                            WHERE houseowner_data.id={}""".format(ho_id))
            supervisorName = cur.fetchone()[0]
            for item in result:
                single_item={}
                single_item["bookingDate"]=item['bookingDate'].strftime(DATE_FORMAT)
                if(item['collectionDate']):
                    single_item["collectiondate"]= item['collectionDate'].strftime(DATE_FORMAT)
                else:
                    single_item["collectiondate"] = STATUS_NA
                single_item["wastetype"]=item['wasteType']
                single_item["supervisorname"]= supervisorName                    
                single_item["status"]=item['status']
                final_list.append(single_item)
            return jsonify(data=final_list),200
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

@houseownercontroller.route('/billgeneration',  methods = ['POST'])
@login_needed
def bill_generation():
    """
    Function is used for generation bill for the online payment.
    The only slots which are collected are  considered in bill.
    """
    data = request.get_json()
    ho_id = data.get('userid')
    today = datetime.date.today()
    current_month = today.month
    try:
        conn = helperfile.get_db_connection()
        if conn:
            app.logger.debug("DB connection opened")
            cur = conn.cursor()
            cur.execute('SELECT id FROM houseowner_paymentstatus WHERE houseowner_id={0}'.format(ho_id))
            user= cur.fetchall()
            if user:
                cur.execute('SELECT last_paydate FROM houseowner_paymentstatus WHERE houseowner_id={}'.format(ho_id))
                last_pay_day = cur.fetchone()
                for day in last_pay_day:
                    last_pay_day=day 
                    last_pay_day=last_pay_day.month
            else:
                last_pay_month = None

            grand_total = 0
            final_list=[]
            if current_month == last_pay_month:
                return jsonify(message="No Pending Bills"),200
            else:
                sql='SELECT DISTINCT waste_id FROM houseowner_slotbooking\
                    WHERE houseowner_id={0} AND payment_status = {1}' .format(ho_id,PAYMENT_STATUS['UNPAID'])
                cur.execute(sql)
                columns = [column[0] for column in cur.description]
                waste_id = cur.fetchall()
                waste_id = tuple_to_dict(waste_id,columns)
                bill_item = {}
                for id in waste_id:
                    sql=("""SELECT SUM(quantity) as total_quantity
                        FROM houseowner_slotbooking
                        INNER JOIN houseowner_bookingstatus ON houseowner_slotbooking.id= houseowner_bookingstatus.slot_id
                        WHERE payment_status = {0}
                        AND houseowner_slotbooking.houseowner_id = {1} 
                        AND houseowner_slotbooking.waste_id = {2}
                        AND houseowner_bookingstatus.status='{3}'""".format(PAYMENT_STATUS['UNPAID'],ho_id,id['waste_id'],STATUS_COLLECTED))
                    cur.execute(sql)
                    bill_item['quantity'] = cur.fetchone()[0]
                    if (not bill_item['quantity']):
                        continue
                    else:
                        cur.execute("SELECT waste_type,charge FROM waste WHERE id={0}".format(id['waste_id']))
                        columns = [column[0] for column in cur.description]
                        waste_details = cur.fetchall()
                        waste_details = tuple_to_dict(waste_details,columns)[0]
                        bill_item['waste_type'] = waste_details['waste_type']
                        bill_item['unit_price'] = waste_details['charge']
                        bill_item['total'] = bill_item['quantity'] * bill_item['unit_price']
                    grand_total = grand_total + bill_item['total']
                    final_list.append(bill_item)
                return jsonify(bill=final_list,grandTotal=grand_total),200    
        else:
            app.logger.error("DB Connection Failed")
            abort(500, "Internal Server Error: CONNECTION FAILED")
    except Exception as exceptn:
        app.logger.error(exceptn)

        abort(500, "Internal Server Error")
    finally:
        if conn:
            cur.close()
            conn.close()                         #db connection closed    
            app.logger.debug("connection closed")

@houseownercontroller.route('/billpayment',  methods = ['POST'])
@login_needed
def payment():
    """
    Function is used for the online bill payment of the house owner.

    """
    data = request.get_json()
    ho_id = data.get('userid')
    pay_date = data.get('paydate')
    grand_total = data.get('grandtotal')
    status = data.get('status')
    try:
        if status == PAYMENT_STATUS['PAID']:           #status is to check if the payment done from frontend
            conn = helperfile.get_db_connection()
            if conn:
                sql="SELECT status,slot_id FROM houseowner_bookingstatus \
                    WHERE status='{0}' AND slot_id in(SELECT id FROM houseowner_slotbooking \
                    WHERE houseowner_id={1} AND payment_status={2} )".format(STATUS_COLLECTED,ho_id,PAYMENT_STATUS['UNPAID'])
                cur = conn.cursor()
                cur.execute(sql)
                columns = [column[0] for column in cur.description]
                slots = cur.fetchall()
                slots = tuple_to_dict(slots,columns)
                for slot in slots:
                    if(slot['status']==STATUS_COLLECTED):
                        cur.execute("UPDATE houseowner_slotbooking SET payment_status={0} WHERE houseowner_id={1} AND id={2}".format(PAYMENT_STATUS['PAID'],ho_id,slot['slot_id']))
                        cur.execute('INSERT INTO houseowner_payment (houseowner_id, total_amount, pay_date)' 'VALUES (%s,%s,%s)',(ho_id, grand_total, pay_date))             
                    cur.execute('SELECT id FROM houseowner_paymentstatus WHERE houseowner_id={} '.format(ho_id))
                    payments = cur.fetchall()
                    if payments is None:
                            cur.execute('INSERT INTO houseowner_paymentstatus (houseowner_id, last_paydate)' 'VALUES (%s,%s)',(ho_id, pay_date))
                    else:
                        cur.execute("UPDATE houseowner_payment SET pay_date='{0}' WHERE houseowner_id={1}".format(pay_date,ho_id))

                return jsonify(message="Successfully Saved"),200
            
            else:
                app.logger.error("DB Connection Failed")

                abort(500, "Internal Server Error: CONNECTION FAILED")
        else:
            app.logger.error("Bad Request")

            abort(500, "Internal Server Error: SOMETHING WENT WRONG")
    except Exception as exceptn:
        app.logger.error(exceptn)

        abort(500, "Internal Server Error")
    finally:
        if conn:
            cur.close()
            conn.close()  #db connection closed    
            app.logger.debug("connection closed")

@houseownercontroller.route('/paymenthistory',  methods = ['POST'])
@login_needed
def payment_history():
    """
    Function to see the payments done by the house owner (payment history)
    it returns the total amount the the payment dates.

    """
    data = request.get_json()
    ho_id = data.get('userid')
    try:
            app.logger.debug("Db connected")
            sql=('SELECT total_amount,pay_date FROM houseowner_payment WHERE houseowner_id={}'.format(ho_id))
            payment_history = execute_query(sql)
            final_list=[]
            for item in payment_history:
                single_item = {}
                single_item["totalAmount"] = item['totalAmount']
                single_item["payDate"] = item['payDate'].strftime(DATE_FORMAT)
                final_list.append(single_item)

            return jsonify(data=final_list),200 
    
    except Exception as exceptn:
        app.logger.error(exceptn)
        abort(500, "Internal Server Error")
    

@houseownercontroller.route('/userprofile',  methods = ['POST'])
@login_needed
def my_profile():
    data = request.get_json()
    ho_id = data.get('userid')
    try:
        conn = helperfile.get_db_connection()
        if conn:
            app.logger.debug("Db connected")
            sql=("""SELECT houseowner_data.firstname AS first_name,houseowner_data.lastname AS last_name,houseowner_data.email,houseowner_data.phoneno AS phone_no,houseowner_data.address,houseowner_data.pincode,ward.wardname AS ward_name from houseowner_data
                    INNER JOIN ward ON houseowner_data.wardno=ward.wardno
                    WHERE id={}""".format(ho_id))
            cur = conn.cursor()
            cur.execute(sql)
            columns = [inflection.camelize(column[0], False) for column in cur.description]
            profile_data = cur.fetchall()
            profile_data = tuple_to_dict(profile_data,columns)
            return jsonify(data=profile_data),200
        else:
                app.logger.error("DB Connection Failed")

                abort(500, "Internal Server Error: CONNECTION FAILED")
    except Exception as exceptn:
        app.logger.error(exceptn)

        abort(500, "Internal Server Error")
    finally:
        if conn:
            cur.close()
            conn.close()                                                    #db connection closed    
            app.logger.debug("connection closed")

@houseownercontroller.route('/houseownerdashboard',  methods = ['POST'])
@login_needed
def houseowner_dashboard():
    data = request.get_json()
    ho_id = data.get('userid')
    try:
        conn = helperfile.get_db_connection()
        if conn:
            app.logger.debug("Db connected")
            cur = conn.cursor()
            cur.execute('SELECT COUNT(*) FROM houseowner_slotbooking WHERE houseowner_id = {}'.format(ho_id))
            slot_count = cur.fetchall()[0]
            cur.execute("SELECT COUNT(*) FROM houseowner_slotbooking INNER JOIN\
                        houseowner_bookingstatus ON houseowner_slotbooking.id = houseowner_bookingstatus.slot_id\
                        WHERE houseowner_slotbooking.houseowner_id = {0}\
                        AND houseowner_bookingstatus.status = '{1}' ".format(ho_id,STATUS_BOOKED))
            pending_slots = cur.fetchall()[0]
            data = {"slotCount":slot_count,"pendingSlots":pending_slots}
            return jsonify(data=data),200 
        else:
                app.logger.error("DB Connection Failed")

                abort(500, "Internal Server Error: CONNECTION FAILED")
    except Exception as exceptn:
        app.logger.error(exceptn)

        abort(500, "Internal Server Error")
    finally:
        if conn:
            cur.close()
            conn.close()                                                    #db connection closed    
            app.logger.debug("connection closed")

@houseownercontroller.route('/houseownerdashboardgraph',  methods = ['POST'])
@login_needed
def houseowner_dashboard_graph():
    data = request.get_json()
    ho_id = data.get('userid')
    try:
        conn = helperfile.get_db_connection()
        if conn:
            app.logger.debug("Db connected")
            cur = conn.cursor()
            cur.execute('SELECT SUM(quantity) AS total_quantity\
                        FROM houseowner_slotbooking\
                        WHERE houseowner_id = {0} AND waste_id = {1} '.format(ho_id,WASTE_PLASTIC))
            plastic_sum = cur.fetchone()[0]
            cur.execute('SELECT SUM(quantity) AS total_quantity\
                        FROM houseowner_slotbooking\
                        WHERE houseowner_id = {0} AND waste_id = {1} '.format(ho_id,WASTE_FOOD))
            food_sum = cur.fetchone()[0]
            cur.execute('SELECT SUM(quantity) AS total_quantity\
                        FROM houseowner_slotbooking\
                        WHERE houseowner_id = {0} AND waste_id = {1} '.format(ho_id,WASTE_EWASTE))
            ewaste_sum = cur.fetchone()[0]
            cur.execute('SELECT SUM(quantity) AS total_quantity\
                        FROM houseowner_slotbooking\
                        WHERE houseowner_id = {0} AND waste_id = {1} '.format(ho_id,WASTE_METAL))
            metal_sum = cur.fetchone()[0]
            cur.execute('SELECT COUNT(*) FROM houseowner_slotbooking WHERE houseowner_id = {}'.format(ho_id))
            slot_count = cur.fetchall()[0]
            cur.execute("SELECT COUNT(*) FROM houseowner_slotbooking INNER JOIN\
                        houseowner_bookingstatus ON houseowner_slotbooking.id = houseowner_bookingstatus.slot_id\
                        WHERE houseowner_slotbooking.houseowner_id = {0}\
                        AND houseowner_bookingstatus.status = '{1}' ".format(ho_id,STATUS_BOOKED))
            pending_slots = cur.fetchall()[0]
            data = {"plastic":plastic_sum,"food":food_sum,"ewaste":ewaste_sum,"metal":metal_sum, "slotCount":slot_count,"pendingSlots":pending_slots}
            return jsonify(data=data),200 
        else:
                app.logger.error("DB Connection Failed")

                abort(500, "Internal Server Error: CONNECTION FAILED")
    except Exception as exceptn:
        app.logger.error(exceptn)

        abort(500, "Internal Server Error")

    finally:
        if conn:
            cur.close()
            conn.close()                                                    #db connection closed    
            app.logger.debug("connection closed")
