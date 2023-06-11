import os
from pymongo import MongoClient

uri = os.environ['CONN_STR']
client = MongoClient(uri)

def getInterests(email):
    try:
        res = client.test.subs.find_one({"email" : email}, {"interests":1})
        return res
    except Exception as e:
        print("An exception occurred ::", e)
        return None


def updateRecommendation(email, recommendation):
    try:
        client.test.subs.update_one({"email" : email}, { "$set": { "recommendation": recommendation } })
        return True
    except Exception as e:
        print("An exception occurred ::", e)
        return False
    
def getAllRecommendations():
    try:
        res = client.test.subs.find({}, {"email":1, "interests":1})
        return res
    except Exception as e:
        print("An exception occurred ::", e)
        return None    