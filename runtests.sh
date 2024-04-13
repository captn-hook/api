#!/bin/sh

url="$(hostname).local:8000"

status() {
    printf "\n=====================================================\n"
    printf "%s\n" "$1"
    printf -- "-----------------------------------------------------\n"
}


# Usage: method '{"key": "value"}' /endpoint
post() {
    curl -X POST -H "Content-Type: application/json" -d "$1" $url$2
}
get() {
    curl -X GET $url$1
}
put() {
    curl -X PUT -H "Content-Type: application/json" -d "$1" $url$2
}
delete() {
    curl -X DELETE $url$1
}

#post 1
user='{"uId": 0}'
post "$user" /users

# openEndpoints: {
#   post: [
#     '/businesses',
#     '/users/:id/businesses',
#     '/businesses/:id/reviews',
#     '/businesses/:id/photos'
#   ],
#   get: [
#     '/businesses/:id',
#     '/businesses/:id/reviews',
#     '/businesses',
#     '/users/:id/businesses',
#     '/users/:id/photos',
#     '/users/:id/reviews'
#   ],
#   put: [ '/businesses/:id', '/photos/:id', '/reviews/:id' ],
#   delete: [ '/reviews/:id', '/businesses/:id', '/photos/:id' ]
# }

user='{
    "uId": 0,
    "ownedBizes": [],
    "photos": [],
    "writtenReviews": []
}'

# starting with posting n sample businesses, reviews, and photos
n1=30
n2=15
n3=25

status "POSTING $n1 BUSINESSES"
for i in $(seq 0 $n1); do
    biz='{
        "bizId": '"$i"',
        "name": "da bomb burritos",
        "address": "123 main st.",
        "city": "fraggle rock",
        "state": "CA",
        "zip": "12345",
        "phone": "123-456-7890",
        "category": "food",
        "subcategories": [],
        "website": "www.dabombburritos.com",
        "email": ""
    }'
    post "$biz" /businesses
done

status "POSTING $n2 REVIEWS"
for i in $(seq 0 $n2); do
    review='{
        "bizId": '"$i"',
        "uId": 0,
        "stars": 4,
        "cost": 3,
        "text": "great food, great service, great prices!"
    }'
    post "$review" /businesses/"$i"/reviews
done

status "POSTING $n3 PHOTOS"
for i in $(seq 0 $n3); do
    photo='{
        "pId": '"$i"',
        "bizId": '"$i"',
        "uId": 0,
        "caption": "yum!",
        "imageUrl": "www.dabombburritos.com/yum.jpg"
    }'
    post "$photo" /businesses/"$i"/photos
done

#check that the right number of businesses, reviews, and photos were posted
status "GETTING ALL BUSINESSES"
if [ $(get /businesses | jq '. | length') -eq $n1 ]; then
    printf "SUCCESS: $n1 businesses posted\n"
else
    printf "FAILURE: $n1 businesses posted\n"
fi

status "GETTING ALL REVIEWS"
if [ $(get /reviews | jq '. | length') -eq $n2 ]; then
    printf "SUCCESS: $n2 reviews posted\n"
else
    printf "FAILURE: $n2 reviews posted\n"
fi

status "GETTING A PHOTOS"
if [ $(get /photos | jq '. | length') -eq $n3 ]; then
    printf "SUCCESS: $n3 photos posted\n"
else
    printf "FAILURE: $n3 photos posted\n"
fi

# now we will update a business, review, and photo
updatedBiz='{
    "bizId": 0,
    "name": "ditos",
    "address": "123 main st.",
    "city": "fraggle rock",
    "state": "CA",
    "zip": "12345",
    "phone": "123-456-7890",
    "category": "food",
    "subcategories": ["burritos"],
    "website": "www.dabombburritos.com",
    "email": ""
}' #check that name is updated
updatedReview='{
    "bizId": 0,
    "uId": 0,
    "stars": 0,
    "cost": "1",
    "text": "great food, great service, great prices!"
}' #check that stars and cost are updated
updatedPhoto='{
    "pId": 0,
    "bizId": 0,
    "uId": 0,
    "caption": "bleck!",
    "imageUrl": "www.dabombburritos.com/yum.jpg"
}' #check that bleck!

status "UPDATING A BUSINESS"
put "$updatedBiz" /businesses/0
response=$(get /businesses/0 | jq '.name' | tr -d '\n')

if [ $response = '"ditos"' ]; then
    printf "SUCCESS: business updated\n"
else
    printf "FAILURE: business not updated\n"
fi

status "UPDATING A REVIEW"
put "$updatedReview" /reviews/0
response=$(get /reviews/0 | jq '.cost' | tr -d '\n')

if [ $response = '"1"' ]; then
    printf "SUCCESS: review updated\n"
else
    printf "FAILURE: review not updated\n"
fi

status "UPDATING A PHOTO"
put "$updatedPhoto" /photos/0
response=$(get /photos/0 | jq '.caption' | tr -d '\n')

if [ $response = '"bleck!"' ]; then
    printf "SUCCESS: photo updated\n"
else
    printf "FAILURE: photo not updated\n"
fi

# now we will delete a business, review, and photo
status "DELETING A BUSINESS"
delete /businesses/0
response=$(get /businesses | jq '. | length')

if [ $response -eq $n1 ]; then
    printf "SUCCESS: business deleted\n"
else
    printf "FAILURE: business not deleted\n"
fi

status "DELETING A REVIEW"
delete /reviews/0
response=$(get /reviews | jq '. | length')

if [ $response -eq $n2 ]; then
    printf "SUCCESS: review deleted\n"
else
    printf "FAILURE: review not deleted\n"
fi

status "DELETING A PHOTO"
delete /photos/0
response=$(get /photos | jq '. | length')

if [ $response -eq $n3 ]; then
    printf "SUCCESS: photo deleted\n"
else
    printf "FAILURE: photo not deleted\n"
fi

