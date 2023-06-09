import time
from db import getInterests, updateRecommendations

def process(email):

    res = getInterests(email)
    interests = res["interests"]
    # time.sleep(10)
    recommendations = ["doi:10.1007/s10044-004-0221-6"]
    updateRecommendations(email, recommendations)
    print("DONE UPDATE RECOMMENDATIONS")
    
