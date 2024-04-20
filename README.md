npm run main


docker build -t api .

docker run -d --name api -p 8000:8000 api