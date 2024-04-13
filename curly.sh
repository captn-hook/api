#tests the endpoints with curl
# Usage: ./curly.sh

#url="http://localhost:8000"
#url="0.0.0.0:1337"
url="127.0.0.1:8000"
#   post: [
#     '/businesses',
#     '/businesses/:id/reviews',
#     '/businesses/:id/photos'
#   ]
#   get: [
#     '/businesses/:id',
#     '/businesses/:id/reviews',
#     '/businesses',
#     '/users/:id/businesses',
#     '/users/:id/photos',
#     '/users/:id/reviews'
#   ]
#   put: [ '/businesses/:id', '/photos/:id', '/reviews/:id' ]
#   delete: [ '/reviews/:id', '/businesses/:id', '/photos/:id' ]

postEndpoints=(
  "/businesses"
  "/businesses/1/reviews"
  "/businesses/1/photos"
  
)

getEndpoints=(
  "/businesses/1"
  "/businesses/1/reviews"
  "/businesses"
)

# sample data
businessData='{"bizId": 1, "name": "test business", "address": "123 test st", "city": "test city", "state": "test state", "zip": "12345", "phone": "123-456-7890", "website": "http://www.test.com", "category": "test category"}'
reviewData='{"bizId": 1, "userId": 1, "stars": 5, "cost": 3, "text": "test review"}'
photoData='{"photoId": 1, "bizId": 1, "userId": 1, "caption": "test caption", "url": "https://www.pinkyprintsco.com/cdn/shop/products/image_b5fa652d-a4dd-49b7-bea0-70b41a0e02fc_530x@2x.jpg?v=1665181738"}'

curl -X POST -H "Content-Type: application/json" -d '{"userId": 1, "name": "test user"}' -4 "127.0.0.1:8000/users"
# post business
curl -X POST -H "Content-Type: application/json" -d "$businessData" -4 $url${postEndpoints[0]}
echo ""

# post review
curl -X POST -H "Content-Type: application/json" -d "$reviewData" -4 $url${postEndpoints[1]}
echo ""

# post photo
curl -X POST -H "Content-Type: application/json" -d "$photoData" -4 $url${postEndpoints[2]}
echo ""

# get requests
for endpoint in ${getEndpoints[@]}; do
  echo "GET $url$endpoint"
  curl -X GET -4 $url$endpoint
  echo ""
done