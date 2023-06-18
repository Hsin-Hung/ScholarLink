import os
import datetime
import random
import requests
import threading
import constant
from concurrent.futures import ThreadPoolExecutor

class Recommender:
    def __init__(self, database):
        self.endpoint = "https://api.springernature.com/meta/v2/json?"
        self.api_key = os.environ['API_KEY']
        self.db = database
        self.updateRecommendationFromYear()
        self.setUpOptions()
    
    def setUpOptions(self):
        self.lastUpdateTotal = datetime.datetime.min
        self.allOptions = self.db.getOptions()
        self.interestToTotal = {}
        if self.allOptions:
            for interest in self.allOptions["values"]:
                self.interestToTotal[interest] = 1
            self.updateInterestsTotal()
            print(self.interestToTotal)

    def updateRecommendationFromYear(self):
        self.fromYear = datetime.date.today().year - constant.RECOMMENDATION_AGE

    def updateUser(self, user):
        email, interests = user["email"], user["interests"]
        recommendation = self.recommend(interests)
        self.db.updateRecommendation(email, recommendation)

    def updateAllRecommendations(self):
        print("Update all recommendations ...")
        # get the email and interests from all subscribers
        if users := self.db.getAllRecommendations():
            for user in users:
                self.updateUser(user)
            print("Done updating recommendations")

    def updateInterestTotal(self, interest):

        self.interestToTotal[interest] = 100
        # url = self.endpoint + "q=subject:%22" + interest + "%22 onlinedatefrom:" + str(self.fromYear) + "-01-01&p=0&api_key=" + self.api_key
        # print("update interest url: %r " % url)
        # try:
        #     response = requests.get(url)
        #     res = response.json()
        #     total = int(res["result"][0]["total"])
        #     print("interest " + interest + " has total: " + str(total))
        #     self.interestToTotal[interest] = total
        # except Exception as e:
        #     print('An error occurred: %r' % str(e))

    def updateInterestsTotal(self):
        print("updating interests total ...")
        self.updateRecommendationFromYear()
        with ThreadPoolExecutor(max_workers=len(self.interestToTotal)) as pool:
            pool.map(self.updateInterestTotal,self.interestToTotal.keys())
            print("fetching and updating each interest total ...")
        
        print("DONE: fetching and updating each interest total")
        self.lastUpdateTotal = datetime.datetime.today()
    
    def getRandomInterest(self, interests):
        return random.choice(interests)
    
    def getInterestTotal(self, interest):
        if interest in self.interestToTotal:
            return self.interestToTotal[interest]
        return 1
    
    def getDaysDifference(self, fromDate, toDate):
        delta = toDate - fromDate
        return delta.days

    def process(self, task, message_id):

        if message_id == "resetRecommendations":
            thread1 = threading.Thread(target=self.updateAllRecommendations)
            thread1.start()
            return True
        elif message_id == "newSubscriber":
            email = task
            if res := self.db.getInterests(email):
                if recommendation := self.recommend(res["interests"]):
                    self.db.updateRecommendation(email, recommendation)
                    print("Done updating interests for %r" % email)
                    return True
        else:
            print("message ID doesn't exist")

        print("Fail updating interests for %r" % task)
        return False
    
    def recommend(self, interests):
        interest = self.getRandomInterest(interests)
        # check whether we need to update the interests total to reflect the new totals
        if self.getDaysDifference(self.lastUpdateTotal, datetime.datetime.today()) >= constant.UPDATE_TOTAL_TTL:
            self.updateInterestsTotal()
        start = random.randrange(1, self.getInterestTotal(interest)+1)
        url = self.endpoint + "q=subject:%22" + interest + "%22 onlinedatefrom:"+ str(self.fromYear) +"-01-01&s=" + str(start) + "&p=1&api_key=" + self.api_key
        print("fetch paper url: %r " % url)
        try:
            response = requests.get(url)
            res = response.json()
            record = res["records"][0]["url"][0]["value"]
            return record
        except Exception as e:
            print('An error occurred:', str(e))
        
        # return the home page if fail to recommend
        return "https://www.springer.com/us"
    
