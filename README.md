# run the server and the api
    docker compose up

this launches the server and the api in the same container from 2 images on a network
you can visit http://localhost:8000 to see all the collections, or individually at

[businesses](http://localhost:8000/businesses)
[reviews](http://localhost:8000/reviews)
[users](http://localhost:8000/users)
[photos](http://localhost:8000/photos)

and you can run 
    
    ./tests/runtests.sh

to test the api, which will also add some data to the database


# just the api
    npm run main
# rebuild the api
    docker build -t api .
# run the api
    docker run -d --name api -p 8000:8000 api