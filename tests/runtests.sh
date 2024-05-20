#!/bin/sh

url="$(hostname).local:8000"

status() {
    printf "\n=====================================================\n"
    printf "%s\n" "$1"
    printf -- "-----------------------------------------------------\n"
}

#get auth
status "GETTING AUTH"
login='{
    "email": "admin@localhost",
    "password": "hunter2"
}'
response=$(curl -X POST -H "Content-Type: application/json" -d "$login" $url/users/login)

if [ -z "$response" ]; then
    printf "FAILURE: Empty response\n"
    exit 1
else
    TOKEN=$response
    printf "SUCCESS: Auth token received\n"
fi

# Usage: method '{"key": "value"}' /endpoint
post() {
    curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d "$1" $url$2
}
get() {
    curl -X GET -H "Authorization: Bearer $TOKEN" $url$1
}
put() {
    curl -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d "$1" $url$2
}
delete() {
    curl -X DELETE -H "Authorization: Bearer $TOKEN" $url$1
}

# getting a user without auth should fail and return 401 with Forbidden as the body
status "GETTING A USER WITHOUT AUTH"
response=$(curl -X GET $url/users/1)
if [ "$response" = "Forbidden" ]; then
    printf "SUCCESS: 401 Forbidden\n"
else
    echo "FAILURE: $response"
    echo "FAILURE: 401 Forbidden"
    exit 1
fi

#post 1
user='{
    "uId": 4,
    "email": "new@user.com",
    "password": "hunter2"
}'
status "POSTING A USER"
response=$(post "$user" /users)
if [ -z "$response" ]; then
    printf "FAILURE: Empty response\n"
    exit 1
else
    printf "SUCCESS: User posted\n"
fi

#get posted user
status "GETTING POSTED USER"
response=$(get /users/4)
if [ -z "$response" ]; then
    printf "FAILURE: Empty response\n"
    exit 1
else
    printf "SUCCESS: User retrieved\n"
fi

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
    "uId": 1,
    "ownedBizes": [],
    "photos": [],
    "writtenReviews": []
}'


# starting with posting n sample businesses, reviews, and photos
n1=30
n2=15
n3=25

#get the current number of businesses, reviews, and photos before posting
status "GETTING ORIGINAL BUSINESSES"
originalBiz=$(get /businesses | jq '. | length')
status "GETTING ORIGINAL REVIEWS"
originalReviews=$(get /reviews | jq '. | length')
status "GETTING ORIGINAL PHOTOS"
originalPhotos=$(get /photos | jq '. | length')

status "POSTING $n1 BUSINESSES"
for i in $(seq 1 $n1); do
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
for i in $(seq 1 $n2); do
    review='{
        "rId": '"$i"',
        "bizId": '"$i"',
        "uId": 1,
        "stars": 4,
        "cost": 3,
        "text": "great food, great service, great prices!"
    }'
    post "$review" /businesses/"$i"/reviews
done

status "POSTING $n3 PHOTOS"
for i in $(seq 1 $n3); do
    photo='{
        "pId": '"$i"',
        "bizId": '"$i"',
        "uId": 1,
        "caption": "yum!",
        "imageUrl": "www.dabombburritos.com/yum.jpg"
    }'
    post "$photo" /businesses/"$i"/photos
done

#check that the right number of businesses, reviews, and photos were posted
status "GETTING ALL BUSINESSES"
if [ $(get /businesses | jq '. | length') -eq $(($n1 + $originalBiz)) ]; then
    printf "SUCCESS: $n1 businesses posted\n"
else
    printf "GOT $(get /businesses | jq '. | length')\n"
    printf "SHOULD BE $(($n1 + $originalBiz))\n"
    printf "FAILURE: $n1 businesses posted\n"
    exit 1
fi

status "GETTING ALL REVIEWS"
if [ $(get /reviews | jq '. | length') -eq $(($n2 + $originalReviews)) ]; then
    printf "SUCCESS: $n2 reviews posted\n"
else
    printf "GOT $(get /reviews | jq '. | length')\n"
    printf "SHOULD BE $(($n2 + $originalReviews))\n"
    printf "FAILURE: $n2 reviews posted\n"
    exit 1
fi

status "GETTING A PHOTOS"
if [ $(get /photos | jq '. | length') -eq $(($n3 + $originalPhotos)) ]; then
    printf "SUCCESS: $n3 photos posted\n"
else
    printf "GOT $(get /photos | jq '. | length')\n"
    printf "SHOULD BE $(($n3 + $originalPhotos))\n"
    printf "FAILURE: $n3 photos posted\n"
    exit 1
fi

# now we will update a business, review, and photo
updatedBiz='{
    "bizId": 1,
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
    "rId": 1,
    "bizId": 1,
    "uId": 1,
    "stars": 0,
    "cost": "1",
    "text": "great food, great service, great prices!"
}' #check that stars and cost are updated
updatedPhoto='{
    "pId": 1,
    "bizId": 1,
    "uId": 1,
    "caption": "bleck!",
    "imageUrl": "www.dabombburritos.com/yum.jpg"
}' #check that bleck!

status "UPDATING A BUSINESS"
put "$updatedBiz" /businesses/1
response=$(get /businesses/1 | jq '.name' | tr -d '\n')

if [ $response = '"ditos"' ]; then
    printf "SUCCESS: business updated\n"
else
    printf "FAILURE: business not updated\n"
    exit 1
fi

status "UPDATING A REVIEW"
put "$updatedReview" /reviews/1
response=$(get /reviews/1 | jq '.cost' | tr -d '\n')

if [ $response = 1 ]; then
    printf "SUCCESS: review updated\n"
else
    printf "FAILURE: review not updated\n"
    exit 1
fi

status "UPDATING A PHOTO"
put "$updatedPhoto" /photos/1
response=$(get /photos/1 | jq '.caption' | tr -d '\n')

if [ $response = '"bleck!"' ]; then
    printf "SUCCESS: photo updated\n"
else
    printf "FAILURE: photo not updated\n"
    exit 1
fi

# now we will delete a business, review, and photo
status "DELETING A BUSINESS"
delete /businesses/1
response=$(get /businesses | jq '. | length')

if [ $response -eq $(($n1 + $originalBiz)) ]; then
    printf "SUCCESS: business deleted\n"
else
    printf "FAILURE: business not deleted\n"
    exit 1
fi

status "DELETING A REVIEW"
delete /reviews/1
response=$(get /reviews | jq '. | length')

if [ $response -eq $(($n2 + $originalReviews)) ]; then
    printf "SUCCESS: review deleted\n"
else
    printf "FAILURE: review not deleted\n"
    exit 1
fi

status "DELETING A PHOTO"
delete /photos/1
response=$(get /photos | jq '. | length')

if [ $response -eq $(($n3 + $originalPhotos)) ]; then
    printf "SUCCESS: photo deleted\n"
else
    printf "FAILURE: photo not deleted\n"
    exit 1
fi

