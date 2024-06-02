echo "UPLOADING PHOTO FILE"
photopath="./tests/test.png"
url="$(hostname).local:8000"

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

response=$(curl -X POST -H "Authorization: Bearer $TOKEN" -F "file=@$photopath" -F "pId=1" -F "bizId=1" -F "uId=1" -F "caption=yum!" -F "imageUrl=https://www.dabombburritos.com/yum.jpg" $url/businesses/1/photos)
echo $response 

response=$(curl -X PUT -H "Authorization: Bearer $TOKEN" -F "file=@$photopath" -F "pId=1" -F "bizId=1" -F "uId=1" -F "caption=yum!" -F "imageUrl=https://www.dabombburritos.com/yum.jpg" $url/photos/1)
echo $response