const bopen = require('bopen');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const delay = require('delay');

var active = false;
var unf = false;
var stime;
var tleft;

http.listen(8899, async () => {
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname));

io.on('connection', async (socket) => {
    socket.on('disconnect', function(){
        if(active && !socket.connected) bopen("http://localhost:8899");
    });
    socket.on('unfocused', () => {
        unf = true;
        if(active && !socket.connected) bopen("http://localhost:8899");
        unf = false;
    })
})

async function main() {
    console.log("Starting break at")
    stime = new Date()
    console.log(stime);
    tleft = 120
    var intv = setInterval(function x() {
        console.log(tleft)
        io.emit('time',tleft)
        tleft -= 1;
        if(tleft == 0) clearInterval(intv)
    },1000)
    bopen("http://localhost:8899")
    active = true;
    await delay(120000);
    console.log("Break ended at")
    console.log(new Date())
    active = false;
    io.emit('close')
    await delay(1800000);
    main()
}

main()