@echo off
setlocal

set "url=0.0.0.0:1337"

set "postEndpoints=/businesses,/businesses/1/reviews,/businesses/1/photos"
set "getEndpoints=/businesses/1,/businesses/1/reviews,/businesses"

set "businessData1={\"bizId\": 1, \"name\": \"test business\", \"address\": \"123 test st\","
set "businessData2=\"city\": \"test city\", \"state\": \"test state\", \"zip\": \"12345\","
set "businessData3=\"phone\": \"123-456-7890\", \"website\": \"http://www.test.com\", \"category\": \"test category\"}"

set "businessData=%businessData1%%businessData2%%businessData3%"

for %%i in (%postEndpoints%) do (
    for /f "delims=," %%j in ("%%i") do (
        curl -X POST -H "Content-Type: application/json" -d "%businessData%" %url%%%j
        echo.
    )
)

for %%i in (%getEndpoints%) do (
    for /f "delims=," %%j in ("%%i") do (
        echo GET %url%%%j
        curl -X GET %url%%%j
        echo.
    )
)

endlocal