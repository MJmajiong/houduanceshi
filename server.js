var net = require('net');          //网络层和运输层   tcp/ip协议
var fs = require('fs');
var globalConf = require('./conf');

var server = net.createServer();
server.listen(globalConf.port, '127.0.0.1');
server.on('listening', function () {
    console.log('服务已启动')
});

server.on("connection", function (socket) {
    socket.on("data", function (data) {
        console.log(data.toString());               //这里输出的是tcp/ip层解析出来的格式，如果http要用，就还需要http层再解析一下，形成http协议所认同的格式
        var url = data.toString().split("\r\n")[0].split(" ")[1];
        try{
            var dataFile = fs.readFileSync(globalConf.basePath + url);
            // var dataFile = fs.readFileSync(__dirname + globalConf.path + url);
            // console.log(dataFile.toString());
            // socket.write("HTTP/1.1 200OK\r\nContent-type:text/html\r\n\r\n" + data.toString());
            socket.write("HTTP/1.1 200OK\r\n\r\n");
            socket.write(dataFile);
        }catch (e) {
            socket.write("HTTP/1.1 200OK\r\nContent-type:text/html\r\n\r\n<html><body><h1>404 NOT FOUND</h1></body></body></html>");
        }
        socket.end();
    })
});

// var server = net.createServer();
// server.listen(12306, '127.0.0.1');
//
// server.on('listening', function () {
//         console.log('服务已启动')
// });
//
// server.on('connection', function (socket) {
//     socket.on('data', function (data) {
//         // console.log(data.toString());
//         var url = data.toString().split("\r\n")[0].split(" ")[1];
//         console.log(url)
//     })
//
// });