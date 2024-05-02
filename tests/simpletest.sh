biz='{
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
}'

url="$(hostname).local:8000"

post() {
    curl -X POST -H "Content-Type: application/json" -d "$1" $url$2
}

post "$biz" /businesses/