const express = require('express');
const path = require('path');
const session = require('express-session');
// const cors = require('cors');
var os = require('os');

const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

app.set('view engine', 'ejs')
app.use('/static', express.static(path.resolve(__dirname,'context')));
app.use(express.json());


let ifaces = os.networkInterfaces();

let _rede = ifaces['Wi-Fi'].filter(n => n.family == 'IPv4')
let _ip = "http://localhost:3000";

if(_rede.length > 0)
    _ip = `http://${_rede[0].address}:3000`; 


app.use((req, res, next) => {
    req.io = io;
    req.myIp = _ip;
    next();
})

app.use(session({
    secret: 'casa-do-julgamento',
    resave: false,
    saveUninitialized: true
}))

// app.use(cors());

app.use(require('./routes'));

// io.on('connection', function(socket){
    
// });

// let _count = 1;

// let _inter = setInterval(function () { 
//                 if(_count % 15 == 0 )
//                     clearInterval(_inter);
                
//                     _count++;
//                     console.log(_count); 
//                     console.log('second passed'); 
//             }, 1000);
            

server.listen(3000, ()=>{
    console.log('Ready localhost:3000');
});