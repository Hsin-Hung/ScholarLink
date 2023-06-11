import os
import requests
import threading
from db import getInterests, updateRecommendation, getAllRecommendations

def updateUser(user):
    email, interests = user["email"], user["interests"]
    recommendation = recommend(interests)
    updateRecommendation(email, recommendation)

def update():
    users = getAllRecommendations()
    for user in users:
        updateUser(user)

def process(task):

    if task == "":
        thread1 = threading.Thread(target=update)
        thread1.start()
    else:
        email = task
        res = getInterests(email)
        recommendation = recommend(res["interests"])
        updateRecommendation(email, recommendation)
        print("DONE UPDATE RECOMMENDATION")

def recommend(interests):
    api_key = os.environ['API_KEY']
    url = "https://api.springernature.com/openaccess/json?q=subject:" + interests[0] + "&api_key=" + api_key
    response = requests.get(url)
    res = response.json()
    print(res)
    count = int(res["result"][0]["total"])
    print(count)
    record = res["records"][0]["url"][0]["value"]
    return record
    
