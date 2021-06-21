const bopen = require('bopen');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const delay = require('delay');

var active = false;
var unf = false;

http.listen(8899, async () => {
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname));

io.on('connection', async (socket) => {
    socket.on('disconnect', function(){
        console.log('dcopen', active, unf)
        if(active && !socket.connected) bopen("http://localhost:8899");
    });
    socket.on('unfocused', () => {
        unf = true;
        console.log('ufopen', active, unf)
        if(active && !socket.connected) bopen("http://localhost:8899");
        unf = false;
    })
})

async function main() {
    bopen("http://localhost:8899")
    active = true;
    await delay(300000);
    active = false;
    await delay(2400000);
    main()
}

main()