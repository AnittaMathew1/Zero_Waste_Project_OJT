import jwt
import psycopg2
import psycopg2.extras
import datetime
import inflection
from flask import abort
from flask import current_app as app
from flask import jsonify
from flask import request
import resources.db_helper.helperfile as helperfile
from resources.routes.routes import corporationcontroller
from resources.auth.Auth import login_needed
from resources.helper_functions.execute_query import execute_query 
from resources.helper_functions.tuple_to_dict import tuple_to_dict
from resources.constant.constant import STATUS_PENDING,PAYMENT_STATUS,WASTE_EWASTE,WASTE_FOOD,WASTE_METAL,STATUS_COLLECTORALLOCATED,\
STATUS_COLLECTED,ROLE_SUPERVISOR,WASTE_PLASTIC,STATUS_BOOKED,ROLE_SUPERVISOR,ROLE_SUPERADMIN,ROLE_ADMIN,ROLES

@corporationcontroller.route('/warddata')
def ward_details():

    """"
    This function is used for getting ward details
    including ward number and ward name 
    """
    try:
        sql='SELECT wardno AS ward_no,wardname AS ward_name FROM ward;'                      #db connection opened
        ward_details=execute_query(sql)
        app.logger.info("getting waste details")

        return jsonify(data=ward_details),200
    except Exception as exceptn:
        app.logger.error(exceptn)

        abort(500, "Internal Server Error")

@corporationcontroller.route('/wastedata')
def waste_details():

    """
    This is a function to get the details of waste, that can be collected from houseowners, 
    such as Waste type and charge.
    """
    try:
        conn = helperfile.get_db_connection()  #db connection opened
        if conn:
            app.logger.debug("DB connection opened")
            cur = conn.cursor()
            sql='SELECT id,waste_type,charge FROM waste ORDER BY id ASC;'
            waste_details = execute_query(sql)

            return jsonify(data=waste_details),200

        else:
            app.logger.error("DB Connection Failed")

            abort(500, "Internal Server Error: DB Connection Failed")

    except Exception as exceptn:
        app.logger.error(exceptn)

        abort(500, "Internal Server Error")

    finally:
        if conn:
            cur.close()
            conn.close()
            app.logger.debug("DB connection closed")
            

@corporationcontroller.route('/collectorlist', methods = ['POST'])
@login_needed
def collector_list():
    """
    This function is used for getting the waste collectors list with respect to the ward selected by the user
    
    """
    data = request.get_json()
    data_supervisor_id = data.get('supervisor_id')
    try:
            sql='SELECT id,firstname AS first_name,lastname AS last_name,email ,phoneno AS phone_NO,address,ward_no \
                FROM corporation_wastecollector WHERE ward_no in(select wardno from ward WHERE supervisor_id={0})'.format(data_supervisor_id)
            waste_collector_list =execute_query(sql)
            if list:

                return jsonify(data=waste_collector_list),200
                
            else:
                app.logger.info("no data from db which matches the entered supervisor_id = {}".format(data_supervisor_id))

                return jsonify(errorMessage="No data matching the id"),200
    except Exception as exceptn:
            app.logger.error(exceptn)

            abort(500, "Internal Server Error")

@corporationcontroller.route('/add-collector', methods = ['POST'])
@login_needed
def post_add_collector():
    """
    This function is used for getting the waste collectors list with respect to the ward selected by the user
    
    """
    data = request.get_json()
    data_supervisor_id = data.get('supervisor_id')
    data_first_name = data.get('firstName')
    data_last_name = data.get('lastName')
    data_email = data.get('email')
    data_phoneno = data.get('phoneno')
    data_address = data.get('address')
    conn = helperfile.get_db_connection()
    try:
        if conn:
            app.logger.debug("DB connection opened")
            cur = conn.cursor()
            cur.execute("SELECT wardno FROM ward WHERE supervisor_id={0}".format(data_supervisor_id))
            ward_no = cur.fetchone()[0]
            cur.execute("INSERT INTO corporation_wastecollector (firstname,lastname,email,phoneno,address,ward_no)\
                        VALUES(%s,%s,%s,%s,%s,%s)",(data_first_name,data_last_name,data_email,data_phoneno,data_address,ward_no))
            
            return jsonify(message="Successfully Updated"),200
    except Exception as exceptn:
            app.logger.error(exceptn)

            abort(500, "Internal Server Error")
    
    finally:
        if conn:
            cur.close()
            conn.close()
            app.logger.debug("DB connection closed")

@corporationcontroller.route('/delete-collector', methods = ['POST'])
@login_needed
def post_delete_collector():
    """
    This function is used for getting the waste collectors list with respect to the ward selected by the user
    
    """
    data = request.get_json()
    data_collectorId = data.get('collector_id')
    conn = helperfile.get_db_connection()
    try:
        if conn:
            app.logger.debug("DB connection opened")
            cur = conn.cursor()
            cur.execute("DELETE FROM corporation_wastecollector WHERE id = {0};".format(data_collectorId))
            return jsonify(message="Successfully Updated"),200
    except Exception as exceptn:
            app.logger.error(exceptn)

            abort(500, "Internal Server Error")
    finally:
        if conn:
            cur.close()
            conn.close()
            app.logger.debug("DB connection closed")

        
@corporationcontroller.route('/update-collector', methods = ['POST'])
@login_needed
def post_update_collector():
    """
    This function is used for getting the waste collectors list with respect to the ward selected by the user
    
    """
    data = request.get_json()
    data_collector_id = data.get('collector_id')
    data_first_name = data.get('firstName')
    data_last_name = data.get('lastName')
    data_email = data.get('email')
    data_phoneno = data.get('phoneno')
    data_address = data.get('address')
    conn = helperfile.get_db_connection()
    try:
        if conn:
            app.logger.debug("DB connection opened")
            cur = conn.cursor()
            cur.execute("UPDATE corporation_wastecollector SET firstname='{0}',lastname='{1}',email='{2}',phoneno='{3}',address='{4}' WHERE id={5}"\
                        .format(data_first_name,data_last_name,data_email,data_phoneno,data_address,data_collector_id))
            return jsonify(message="Successfully Updated"),200
    except Exception as exceptn:
            app.logger.error(exceptn)

            abort(500, "Internal Server Error")

    finally:
        if conn:
            cur.close()
            conn.close()
            app.logger.debug("DB connection closed")
        
@corporationcontroller.route('/wastecollectionstatus', methods = ['POST'])
@login_needed
def post_collection_status():
    """
    This function is used for getting the waste collection status with respect to the collection date entered by the user
    
    """
    conn = helperfile.get_db_connection()  #db connection opened
    try:
        data = request.get_json()
        collection_date = data.get('collection_date')
        if conn:
            app.logger.debug("DB connection opened")
            cur = conn.cursor()
            cur.execute("""SELECT DISTINCT  CONCAT(corporation_employee.firstname, ' ', corporation_employee.lastname) AS supervisor_name, houseowner_collectionstatus.status,ward.wardname AS ward_name
                            FROM houseowner_collectionstatus
                            INNER JOIN corporation_employee ON corporation_employee.id=houseowner_collectionstatus.supervisor_id
                            INNER JOIN ward ON ward.supervisor_id=corporation_employee.id
                            WHERE houseowner_collectionstatus.collection_date ='{}'""".format(collection_date))
            columns = [inflection.camelize(column[0], False) for column in cur.description]
            collection_status = cur.fetchall()
            collection_status=tuple_to_dict(collection_status,columns)
            if(collection_status):
                data = [collection_status]
                return jsonify(data=data),200

            else:
                app.logger.info("no data from db which matches the entered book id")

                return jsonify(data=[]),200
        else:
            app.logger.error("DB Connection Failed")

            abort(500, "Internal Server Error: CONNECTION FAILED")

    except Exception as exceptn:
        app.logger.error(exceptn)

        abort(500, "Internal Server Error")

    finally:
        if conn:
            cur.close()
            conn.close()
            app.logger.info("DB connection closed")

@corporationcontroller.route('/paymentreport')
@login_needed
def payment_report():
    """
    This API is used for showing payment report of houseowners to the corporation Admins
    """
    conn = helperfile.get_db_connection()
    try:
        conn = helperfile.get_db_connection()
        if conn:
            app.logger.debug("DB Connected")
            cur = conn.cursor()
            sql='SELECT houseowner_id,last_paydate FROM houseowner_paymentstatus'
            cur = conn.cursor()
            cur.execute(sql)
            columns = [column[0] for column in cur.description]
            payment_status = cur.fetchall()
            payment_status=tuple_to_dict(payment_status,columns)
            today = datetime.date.today()
            current_month = today.month      
            final_list=[]
            for item in payment_status:
                hoId = item['houseowner_id']
                lastpay_month = item['last_paydate'].month
                cur.execute("""SELECT CONCAT(houseowner_data.firstname, ' ', houseowner_data.lastname) AS full_name, houseowner_data.phoneno, houseowner_data.address,ward.wardname 
                                FROM houseowner_data
                                INNER JOIN ward on houseowner_data.wardno=ward.wardno
                                WHERE houseowner_data.id={}""".format(hoId))
                columns = [column[0] for column in cur.description]
                single_item = cur.fetchall()
                single_item = tuple_to_dict(single_item,columns)
                if current_month == lastpay_month:    
                    single_item["status"] = PAYMENT_STATUS['PAID']
                else:
                    single_item["status"] = STATUS_BOOKED
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
            conn.close()
            app.logger.debug("DB connection closed")

        
@corporationcontroller.route('/collectorallocation', methods = ['POST'])
@login_needed
def collector_allocation():
    """
    This API is used for allocating waste collection date for waste pickup for houeowners
    """
    data = request.get_json()
    supervisor_id = data.get('supervisor_id')
    collection_date = data.get('collection_date')
    try:
        conn = helperfile.get_db_connection()
        if conn:
            app.logger.debug("DB Connected")
            cur = conn.cursor()
            cur.execute('SELECT wardno FROM ward where supervisor_id={}'.format(supervisor_id))
            ward_no = cur.fetchone()[0]
            cur.execute('INSERT INTO houseowner_collectionstatus \
                        (status,supervisor_id,ward_no,collection_date) \
                        VALUES (%s,%s,%s,%s) RETURNING id',(STATUS_PENDING,supervisor_id,ward_no,collection_date))
            id = cur.fetchone()
            cur.execute('SELECT slot_id FROM houseowner_bookingstatus WHERE supervisor_id = {0}'.format(supervisor_id))
            columns = [column[0] for column in cur.description]
            booking_status = []
            for row in cur.fetchall():
                booking_status.append(dict(zip(columns, row)))
            for slots in booking_status:
                    slot_id=slots['slot_id']
                    cur.execute('SELECT houseowner_id FROM houseowner_slotbooking WHERE id={}'.format(slot_id))
                    ho_id = cur.fetchone()
                    cur.execute('SELECT wardno FROM houseowner_data WHERE id={}'.format(ho_id[0]))
                    ward_number = cur.fetchone()
                    cur.execute("SELECT status from houseowner_bookingstatus Where slot_id={}".format(slot_id))
                    booking_status_data = cur.fetchone()
                    if(ward_number[0] == ward_no):
                        if booking_status_data[0] == STATUS_PENDING:
                            cur.execute("UPDATE houseowner_bookingstatus \
                                        SET collection_date='{0}'\
                                        WHERE slot_id={1}".format(collection_date,slot_id))
            return ({'message':"Successfully Updated"}),200
        else:
            app.logger.error("DB Connection Failed")

            abort(500, "Internal Server Error: CONNECTION FAILED")
            
    except Exception as exceptn:
        app.logger.error(exceptn)

        abort(500, "Internal Server Error")
    
    finally:
        if conn:
            cur.close()
            conn.close()
            app.logger.debug("DB connection closed")


@corporationcontroller.route('/wastereport', methods = ['POST'])
@login_needed
def waste_report():
    """
    This API is used to show to waste report in each ward with respect to each waste type
    """
    data = request.get_json()
    waste_id = data.get('wasteid')
    try:
        conn = helperfile.get_db_connection()
        if conn:
            app.logger.debug("DB connected")
            cur = conn.cursor()
            cur.execute('SELECT id,quantity,houseowner_id FROM houseowner_slotbooking WHERE waste_id={}'.format(waste_id))
            columns = [column[0] for column in cur.description]
            slots = cur.fetchall()
            slots = tuple_to_dict(slots,columns)

            ward_quantity_list = {}
            for slot in slots:
                cur.execute('SELECT status FROM houseowner_bookingstatus WHERE slot_id={}'.format(slot['id']))
                status = cur.fetchone()
                if status != STATUS_COLLECTED:
                    cur.execute('SELECT wardno FROM houseowner_data WHERE id={}'.format(slot['houseowner_id']))
                    ward_no = cur.fetchone()[0]
                    cur.execute('SELECT wardname FROM ward WHERE wardno={}'.format(ward_no))
                    ward_name = cur.fetchone()[0]
                    if ward_name not in ward_quantity_list:
                        ward_quantity_list[ward_name] = slot['quantity']
                    else:
                        ward_quantity_list[ward_name] = ward_quantity_list[ward_name] + slot['quantity']
            final_list = [ward_quantity_list]

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
            conn.close()
            app.logger.debug("DB connection closed")


@corporationcontroller.route('/collectionstatusupdate', methods = ['POST'])
@login_needed
def collection_status_update():
    """
    This API is used for updating collection status by the supervisor
    """
    data = request.get_json()
    supervisor_id = data.get('employee_id')
    status = data.get('status')
    collection_date = data.get('collection_date')
    try:
        conn = helperfile.get_db_connection()
        if conn:
            app.logger.info("DB connected")
            cur = conn.cursor()
            cur.execute("SELECT slot_id FROM houseowner_bookingstatus \
                        WHERE supervisor_id={0} AND collection_date='{1}' AND status='{2}' ".format(supervisor_id,collection_date,STATUS_PENDING))
            slot_id=cur.fetchall()
            for slots in slot_id:
                cur.execute("UPDATE houseowner_collectionstatus SET status='{0}' WHERE supervisor_id={1} AND collection_date='{2}' AND status='{3}' ".format(status,supervisor_id,collection_date,STATUS_PENDING))
                cur.execute("UPDATE houseowner_bookingstatus SET status='{0}' WHERE supervisor_id={1} AND collection_date='{2}' AND status='{3}' ".format(status,supervisor_id,collection_date,STATUS_PENDING))

            return jsonify( message="Successfully Updated"),200
        else:
            app.logger.error("DB Connection Failed")
            abort(500, "Internal Server Error: CONNECTION FAILED")

    except Exception as exceptn:
        app.logger.error(exceptn)

        abort(500, "Internal Server Error")

    finally:
        if conn:
            cur.close()
            conn.close()
            app.logger.debug("DB connection closed")


@corporationcontroller.route('/updatecollector',  methods = ['PUT'])
@login_needed
def update_collector():
    """
    Function for updating the waste collector's details like email, phone number and address.

    """
    data = request.get_json()
    data_id =data.get('id')
    data_email=data.get('email')
    data_phoneno=data.get('phoneno')
    data_address=data.get('address')
    try:
        conn = helperfile.get_db_connection()
        if conn:
            cur = conn.cursor()
            cur.execute('SELECT id FROM corporation_wastecollector WHERE id={} '.format(data_id))
            collector = cur.fetchall()
            if collector is None:
                return jsonify(errorMessage="Not Found"),404
            else:
                cur.execute('UPDATE corporation_wastecollector SET email=%s,phoneno=%s,address=%s WHERE id=%s',[data_email,data_phoneno,data_address,data_id])
                return jsonify(message="Successfully Updated"),200
        else:
            app.logger.error("DB Connection Failed")

            abort(500, "Internal Server Error: CONNECTION FAILED")
    except Exception as exceptn:
        app.logger.error(exceptn)

        abort(500, "Internal Server Error")
    finally:
        if conn:
            cur.close()
            conn.close()
            app.logger.debug("DB connection closed")

@corporationcontroller.route('/corporationdashboard',  methods = ['GET'])
@login_needed
def corporation_dashboard():
    """
    This function is used for corporation dashboard details
    """
    try:
        conn = helperfile.get_db_connection()
        if conn:
            app.logger.debug("Db connected")
            cur = conn.cursor()
            cur.execute('SELECT w.wardname, SUM(s.quantity) AS total_slots_booked\
                        FROM houseowner_slotbooking s\
                        JOIN houseowner_data h ON s.houseowner_id = h.id\
                        JOIN ward w ON h.wardno = w.wardno\
                        GROUP BY w.wardname\
                        ORDER BY total_slots_booked DESC\
                        LIMIT 1;')
            highest_collected_ward = cur.fetchall()[0]
            cur.execute("SELECT w.wardname, SUM(s.quantity) AS total_slots_booked\
                        FROM houseowner_slotbooking s\
                        JOIN houseowner_data h ON s.houseowner_id = h.id\
                        JOIN ward w ON h.wardno = w.wardno\
                        GROUP BY w.wardname\
                        ORDER BY total_slots_booked ASC\
                        LIMIT 1;")
            lowest_collected_ward = cur.fetchall()[0]
            cur.execute("SELECT COUNT(*) AS total_bookings\
                        FROM houseowner_slotbooking\
                        WHERE DATE_PART('month', booking_date) = DATE_PART('month', CURRENT_DATE)\
                        AND DATE_PART('year', booking_date) = DATE_PART('year', CURRENT_DATE);")
            total_slot_booked = cur.fetchall()[0]
            data = [{"highestCollectedWard":highest_collected_ward,"lowestCollectedWard":lowest_collected_ward,"totalSlotBooked":total_slot_booked}]
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

@corporationcontroller.route('/supervisordashboard',  methods = ['POST'])
@login_needed
def supervisor_dashboard():
    """
    This function is used for supervisor dashboard

    """
    try:
        data = request.get_json()
        supervisor_id = data.get('supervisor_id')
        conn = helperfile.get_db_connection()
        if conn:
            app.logger.debug("Db connected")
            cur = conn.cursor()
            cur.execute("SELECT COUNT(*) AS total_booking_plastic\
                        FROM houseowner_slotbooking\
                        INNER JOIN waste ON houseowner_slotbooking.waste_id = waste.id\
                        WHERE waste.id = '{0}'".format(WASTE_PLASTIC))
            plastic_collected = cur.fetchall()[0]
            cur.execute("SELECT COUNT(*) AS total_booking_plastic\
                        FROM houseowner_slotbooking\
                        INNER JOIN waste ON houseowner_slotbooking.waste_id = waste.id\
                        WHERE waste.id = '{0}'".format(WASTE_FOOD))
            food_collected = cur.fetchall()[0]
            cur.execute("SELECT COUNT(*) AS total_booking_plastic\
                        FROM houseowner_slotbooking\
                        INNER JOIN waste ON houseowner_slotbooking.waste_id = waste.id\
                        WHERE waste.id = '{0}'".format(WASTE_EWASTE))
            ewaste_collected = cur.fetchall()[0]
            cur.execute("SELECT COUNT(*) AS total_booking_plastic\
                        FROM houseowner_slotbooking\
                        INNER JOIN waste ON houseowner_slotbooking.waste_id = waste.id\
                        WHERE waste.id = '{0}'".format(WASTE_METAL))
            metal_collected = cur.fetchall()[0]
            sql=("""SELECT CONCAT(houseowner_data.firstname,' ',houseowner_data.lastname) AS houseownerName, houseowner_slotbooking.waste_id,houseowner_bookingstatus.status,
                    houseowner_bookingstatus.collection_date,houseowner_bookingstatus.slot_id
                    FROM houseowner_data
                    INNER JOIN houseowner_slotbooking ON houseowner_data.id = houseowner_slotbooking.houseowner_id
                    INNER JOIN houseowner_bookingstatus ON houseowner_slotbooking.id = houseowner_bookingstatus.slot_id
                    WHERE houseowner_bookingstatus.supervisor_id = {0}""".format(supervisor_id))
            cur.execute(sql)    
            columns = [column[0] for column in cur.description]
            collection_final_list = cur.fetchall()
            collection_final_list=tuple_to_dict(collection_final_list,columns)
            data = {"plasticCollected":plastic_collected,"foodCollected":food_collected,"ewasteCollected":ewaste_collected,"metalCollected":metal_collected,"collection_status":collection_final_list}
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

@corporationcontroller.route('/wardwise-supervisorlist',methods = ['GET'])
@login_needed
def supervisor_list():
    """
    This function is used for getting list of supervisors from the table employees
    
    """
    try:
            app.logger.info("connection opened")
            sql=("SELECT w.wardname AS ward_name, w.wardno AS ward_no, w.supervisor_id, ce.firstname AS first_name, ce.lastname AS last_name, ce.phoneno AS phone_no\
                FROM ward w\
                INNER JOIN corporation_employee ce ON w.supervisor_id = ce.id ORDER BY w.wardno ASC")
            supervisor_list = execute_query(sql)
            app.logger.info("Getting supervisor details")
            return jsonify(data=supervisor_list),200

    except Exception as exceptn:
        app.logger.error(exceptn)

        abort(500, "Internal Server Error")


@corporationcontroller.route('/supervisor-update',methods = ['POST'])
@login_needed
def update_supervisor():
    """
    This function is used for updating supervisor for each ward
    
    """
    data = request.get_json()
    ward_no = data.get('wardno')
    supervisor_firstname = data.get('supervisor_firstname')
    supervisor_lastname = data.get('supervisor_lastname')
    supervisor_phoneno = data.get('supervisor_phoneno')
    try:
        conn = helperfile.get_db_connection()  #db connection opened
        if conn:
            app.logger.debug("connection opened")
            cur = conn.cursor()
            sql=("SELECT supervisor_id FROM ward WHERE wardno ={0}".format(ward_no))
            cur.execute(sql)
            supervisor_id = cur.fetchone()[0]
            cur.execute("UPDATE corporation_employee SET firstname= '{0}', lastname= '{1}', phoneno ='{2}' WHERE id={3}".format(supervisor_firstname,supervisor_lastname,supervisor_phoneno,supervisor_id))
            return jsonify(message="Successfully Updated"),200

        else:
            app.logger.error("DB Connection Failed")

            abort(500, "Internal Server Error: CONNECTION FAILED")

    except Exception as exceptn:
        app.logger.error(exceptn)

        abort(500, "Internal Server Error")

    finally:
        if conn:
            cur.close()
            conn.close()
            app.logger.error("DB connection closed")

@corporationcontroller.route('/wastedetails-update',methods = ['POST'])
@login_needed
def update_waste_details():
    """
    This function is used for updating waste collection charge
    
    """
    data = request.get_json()
    waste_id = data.get('waste_id')
    waste_rate = data.get('waste_rate')
    try:
        conn = helperfile.get_db_connection()  #db connection opened
        if conn:
            app.logger.debug("connection opened")
            cur = conn.cursor()
            cur.execute("UPDATE waste SET charge={0}  WHERE id={1}".format(waste_rate,waste_id))
            return jsonify(message="Successfully Updated"),200

        else:
            app.logger.error("DB Connection Failed")

            abort(500, "Internal Server Error: CONNECTION FAILED")

    except Exception as exceptn:
        app.logger.error(exceptn)

        abort(500, "Internal Server Error")

    finally:
        if conn:
            cur.close()
            conn.close()
            app.logger.debug("DB connection closed")

@corporationcontroller.route('/supervisordashboard-status',methods = ['POST'])
@login_needed
def supervisor_dashboard_status():
    """
    This function is used for getting the collection status of supervisor
    
    """
    data = request.get_json()
    supervisor_id = data.get('supervisor_id')
    try:
        conn = helperfile.get_db_connection()  #db connection opened
        if conn:
            app.logger.info("connection opened")
            cur = conn.cursor()
            sql=("""SELECT CONCAT (houseowner_data.firstname, houseowner_data.lastname) AS houseowner_name, houseowner_slotbooking.waste_id,houseowner_bookingstatus.status,
                    houseowner_bookingstatus.collection_date,houseowner_bookingstatus.slot_id
                    FROM houseowner_data
                    INNER JOIN houseowner_slotbooking ON houseowner_data.id = houseowner_slotbooking.houseowner_id
                    INNER JOIN houseowner_bookingstatus ON houseowner_slotbooking.id = houseowner_bookingstatus.slot_id
                    WHERE houseowner_bookingstatus.supervisor_id = {0}""".format(supervisor_id))
            cur.execute(sql)    
            columns = [inflection.camelize(column[0], False) for column in cur.description]
            collection_data = cur.fetchall()
            collection_data=tuple_to_dict(collection_data,columns)

            return jsonify(data=collection_data),200

        else:
            app.logger.error("DB Connection Failed")

            abort(500, "Internal Server Error: CONNECTION FAILED")

    except Exception as exceptn:
        app.logger.info(exceptn)

        abort(500, "Internal Server Error")

    finally:
        if conn:
            cur.close()
            conn.close()
            app.logger.info("DB connection closed")


@corporationcontroller.route('/houseowners-list',methods = ['GET'])
@login_needed
def houseowners_list():
    """
    This function is used for getting all the houseowners registered in the application
    
    """
    try:
        conn = helperfile.get_db_connection()  #db connection opened
        if conn:
            app.logger.debug("connection opened")
            cur = conn.cursor()
            sql=("""SELECT CONCAT(houseowner_data.firstname, ' ', houseowner_data.lastname) AS full_name,houseowner_data.email,houseowner_data.phoneno AS phone_no,houseowner_data.address,ward.wardname AS ward_name
                    FROM houseowner_data
                    INNER JOIN ward ON houseowner_data.wardno=ward.wardno ORDER BY houseowner_data.firstname ASC""")
            cur.execute(sql)    
            columns = [inflection.camelize(column[0], False) for column in cur.description]
            houseowner_data = cur.fetchall()
            houseowner_data=tuple_to_dict(houseowner_data,columns)
            
            return jsonify(data=houseowner_data),200

        else:
            app.logger.error("DB Connection Failed")

            abort(500, "Internal Server Error: CONNECTION FAILED")

    except Exception as exceptn:
        app.logger.error(exceptn)

        abort(500, "Internal Server Error")

    finally:
        if conn:
            cur.close()
            conn.close()
            app.logger.debug("DB connection closed")


@corporationcontroller.route('/add-ward',methods = ['POST'])
@login_needed
def add_ward():
    """
    This function is used for adding new ward and corresponding supervisor the database    
    """
    try:
        data = request.get_json()
        data_ward_name = data.get('wardName')
        data_ward_number = data.get('wardNumber')
        data_supervisor_first_name = data.get('supervisorFirstName')
        data_supervisor_last_name = data.get('supervisorLastName')
        data_supervisor_phone_no = data.get('supervisorPhoneNo')
        data_supervisor_email = data.get('supervisorEmail')
        conn = helperfile.get_db_connection()  #db connection opened
        if conn:
            app.logger.debug("connection opened")
            cur = conn.cursor()
            cur.execute("INSERT INTO corporation_employee (firstname,lastname,email,phoneno,role_id)\
                        VALUES(%s,%s,%s,%s,%s) RETURNING id",(data_supervisor_first_name,data_supervisor_last_name,data_supervisor_email,data_supervisor_phone_no,ROLE_SUPERVISOR))
            id = cur.fetchone()[0]
            if (id):
                cur.execute("INSERT INTO ward (wardno,wardname,supervisor_id) VALUES(%s,%s,%s)" ,(data_ward_number,data_ward_name,id))
            
            return jsonify(message="Data sucessfully inserted"),200

        else:
            app.logger.error("DB Connection Failed")

            abort(500, "Internal Server Error: CONNECTION FAILED")

    except Exception as exceptn:
        app.logger.error(exceptn)

        abort(500, "Internal Server Error")

    finally:
        if conn:
            cur.close()
            conn.close()
            app.logger.debug("DB connection closed")


@corporationcontroller.route('/userprofile',methods = ['POST'])
@login_needed
def userProfile():
    """
    This function is used getting data for user profile for corporation employees  
    """
    try:
        data = request.get_json()
        data_user_id = data.get('userId')
        data_role_id = data.get('roleId')
        conn = helperfile.get_db_connection()  #db connection opened
        if conn:
            app.logger.debug("connection opened")
            cur = conn.cursor()
            if (data_role_id == ROLE_SUPERVISOR):
                cur.execute("""SELECT corporation_employee.firstname,corporation_employee.lastname,corporation_employee.email,corporation_employee.phoneno,ward.wardname from corporation_employee
                                INNER JOIN ward ON ward.supervisor_id=corporation_employee.id WHERE id={}""".format(data_user_id))
                columns = [column[0] for column in cur.description]
                profile_data = cur.fetchall()
                profile_data = tuple_to_dict(profile_data,columns)[0]
                profile_data.update({"role":ROLES['SUPERVISOR']})
            else:
                cur.execute("""SELECT email,phoneno from corporation_employee WHERE id={}""".format(data_user_id))
                columns = [column[0] for column in cur.description]
                profile_data = cur.fetchall()
                profile_data = tuple_to_dict(profile_data,columns)[0]
                if(data_role_id == ROLE_SUPERADMIN):
                    profile_data.update({'role':ROLES['SUPERADMIN']})
                else:
                    profile_data['role']=ROLES['ADMIN']
            data = [profile_data]
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
            conn.close()
            app.logger.debug("DB connection closed")
