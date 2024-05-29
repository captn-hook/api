echo "UPLOADING PHOTO FILE"
photopath="./tests/test.png"
url="$(hostname).local:8000"

response=$(curl -X POST -H "Authorization: Bearer $TOKEN" -F "file=@$photopath" $url/businesses/1/photos)

echo $response #invalid data