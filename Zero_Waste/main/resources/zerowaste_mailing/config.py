from flask_mail import Mail
from run import app

app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT']=465
app.config['MAIL_USERNAME'] = 'mathewanitta1998@gmail.com' # replace with your email
app.config['MAIL_PASSWORD'] = 'bnrjlzsizaejaqwz' # replace with your password
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_DEFAULT_SENDER'] = 'mathewanitta1998@gmail.com' # replace with your email
mail = Mail(app)