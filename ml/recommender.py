import os
import datetime
import random
import requests
import threading
from concurrent.futures import ThreadPoolExecutor

allInterests = ["Behavioral Sciences", "Biomedicine", "Business and Management", "Chemistry", 
                "Climate", "Computer Science", "Earth Sciences", "Economics", "Education", "Energy",
                "Engineering", "Environment", "Geography", "Psychology", "Political Science", "History",
                "Law", "Life Sciences", "Materials Science", "Mathematics", "Pharmacy", "Philosophy", "Physics", "Public Health", 
                "Social Sciences", "Statistics", "Literature"]

class Recommender:
    def __init__(self, database):
        self.endpoint = "https://api.springernature.com/meta/v2/json?"
        self.api_key = os.environ['API_KEY']
        self.db = database
        self.fromYear = datetime.date.today().year - 6 # only recommend research paper that is recent 6 years
        self.lastUpdateTotal = datetime.datetime.min
        self.interestToTotal = {}
        for interest in allInterests:
            self.interestToTotal[interest] = 1
        self.updateInterestsTotal()

    def updateUser(self, user):
        email, interests = user["email"], user["interests"]
        recommendation = self.recommend(interests)
        self.db.updateRecommendation(email, recommendation)

    def update(self):
        print("Update all recommendations ...")
        # get the email and interests from all subscribers
        users = self.db.getAllRecommendations()
        for user in users:
            self.updateUser(user)
        print("Done updating recommendations")

    def updateInterest(self, interest):
        url = self.endpoint + "q=subject:%22" + interest +"%22 onlinedatefrom:" + str(self.fromYear) + "-01-01&p=0&api_key=" + self.api_key
        print("update interest url: " + url)
        try:
            response = requests.get(url)
            res = response.json()
            total = int(res["result"][0]["total"])
            print("interest " + interest + " has total: " + str(total))
            self.interestToTotal[interest] = total
        except:
            print("Error occurred")

    def updateInterestsTotal(self):
        print("Updating interests total ...")
        self.fromYear = datetime.date.today().year - 6
        with ThreadPoolExecutor(max_workers=len(allInterests)) as pool:
            pool.map(self.updateInterest,self.interestToTotal.keys())
            print("fetching and updating each interest total ...")
        
        print("DONE: fetching and updating each interest total")
        self.lastUpdateTotal = datetime.datetime.today()
    
    def getRandomInterest(self, interests):
        return random.choice(interests)
    
    def getDaysDifference(self, fromDate, toDate):
        delta = toDate - fromDate
        return delta.days

    def process(self, task, message_id):

        if message_id == "resetRecommendations":
            thread1 = threading.Thread(target=self.update)
            thread1.start()
            return True
        elif message_id == "newSubscriber":
            email = task
            res = self.db.getInterests(email)
            recommendation = self.recommend(res["interests"])
            if recommendation:
                self.db.updateRecommendation(email, recommendation)
                print("DONE UPDATE RECOMMENDATION")
                return True
        else:
            print("ERROR: message ID doesn't exist")

        return False
    
    def recommend(self, interests):
        interest = self.getRandomInterest(interests)
        if self.getDaysDifference(self.lastUpdateTotal, datetime.datetime.today()) > 6:
            self.updateInterestsTotal()
        start = random.randrange(1, self.interestToTotal[interest])
        url = self.endpoint + "q=subject:%22" + interest + "%22 onlinedatefrom:"+ str(self.fromYear) +"-01-01&s=" + str(start) + "&p=1&api_key=" + self.api_key
        print("fetch paper url: " + url)
        try:
            response = requests.get(url)
            res = response.json()
            record = res["records"][0]["url"][0]["value"]
            return record
        except:
            print("Error occurred")
        return ""
    
