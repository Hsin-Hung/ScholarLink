import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure


class DB:
    def __init__(self, uri):
        self.uri = uri
        
    def __enter__(self):
        self.client = MongoClient(self.uri)
        return self
            
    def __exit__(self, exc_type, exc_value, exc_traceback):
        self.client.close()

    def getInterests(self, email):
        try:
            res = self.client.test.subs.find_one({"email" : email}, {"interests":1})
            return res
        except Exception as e:
            print("An exception occurred ::", e)
            return None

    def updateRecommendation(self, email, recommendation):
        try:
            self.client.test.subs.update_one({"email" : email}, { "$set": { "recommendation": recommendation } })
            return True
        except Exception as e:
            print("An exception occurred ::", e)
            return False
    
    def getAllRecommendations(self):
        try:
            res = self.client.test.subs.find({}, {"email":1, "interests":1})
            return res
        except Exception as e:
            print("An exception occurred ::", e)
            return None    