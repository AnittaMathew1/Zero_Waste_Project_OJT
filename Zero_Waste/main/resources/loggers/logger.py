
import logging
from run import app

logFormatStr = '[%(asctime)s] p%(process)s {%(pathname)s:%(lineno)d} %(levelname)s - %(message)s'
formatter = logging.Formatter(logFormatStr,'%m-%d %H:%M:%S')

fileHandler = logging.FileHandler("summary.log")
fileHandler.setLevel(logging.DEBUG)
fileHandler.setFormatter(formatter)

streamHandler = logging.StreamHandler()
streamHandler.setLevel(logging.DEBUG)
streamHandler.setFormatter(formatter)

app.logger.addHandler(fileHandler)
app.logger.addHandler(streamHandler)