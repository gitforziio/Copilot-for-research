
if [[ "$1" == "build" ]]
then
  echo build start
  docker build -t youdian_backend .
fi

if [[ "$1" == "start" ]]
then
    server_port=9191
    if [[ "$2" == "prod" ]]
    then 
        server_port=5000
    fi
    echo $server_port
    echo start server on "$server_port"
    docker run -p $server_port:5000 -d youdian_backend
fi
