# run the server and the api
docker compose up
# just the api
npm run main
# rebuild the api
docker build -t api .
# run the api
docker run -d --name api -p 8000:8000 api