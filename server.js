const PORT = 8000
const HOST = "localhost:"
const SERVICE = "https://"

function startSever(service, host, port) {
    console.log("Starting Blog Application Server")
    console.log("Server started at: ", service + host + port);
}

startSever(SERVICE, HOST, PORT);