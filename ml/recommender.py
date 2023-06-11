import os
import requests
import threading
from db import getInterests, updateRecommendation, getAllRecommendations

def updateUser(user):
    email, interests = user["email"], user["interests"]
    recommendation = recommend(interests)
    updateRecommendation(email, recommendation)

def update():
    print("Resetting recommendations")
    users = getAllRecommendations()
    for user in users:
        updateUser(user)
    print("Done Resetting recommendations")

def process(task, message_id):

    if message_id == "resetRecommendations":
        thread1 = threading.Thread(target=update)
        thread1.start()
    elif message_id == "newSubscriber":
        email = task
        res = getInterests(email)
        recommendation = recommend(res["interests"])
        updateRecommendation(email, recommendation)
        print("DONE UPDATE RECOMMENDATION")
    else:
        print("ERROR: message ID doesn't exist")

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
    
