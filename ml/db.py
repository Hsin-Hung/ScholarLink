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


def updateRecommendations(email, recommendations):
    try:
        client.test.subs.update_one({"email" : email}, { "$set": { "recommendations": recommendations } })
        return True
    except Exception as e:
        print("An exception occurred ::", e)
        return False       