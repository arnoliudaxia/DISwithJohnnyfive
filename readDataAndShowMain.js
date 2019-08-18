var five=require("johnny-five");
var board=new five.Board();
var io =require("socket.io");
var express=require("express");
var app=express();
var path=require("path");

app.use(express.static(path.join(__dirname, 'public')));
var server=app.listen(3002,function (req,res) {
   console.log("server is on 3002");
});

var sio=io(server);
sio.on("connection",function (socket) {
   console.log("User online");
});

board.on("ready",function () {
    console.log("Arduino已连接");
   // var senA0=new five.Sensor("A0");
    var analogSensors=new five.Sensors(["A0","A1","A2","A3","A4","A5"]);
    //var digitalSensors=new five.Sensors([0,1,2,3,4,5,6,7,8,9,10,11,12,13]);
    var sensorsData={
      "senA0":0,
      'senA1':0,
      'senA2':0,
      'senA3':0,
      'senA4':0,
      'senA5':0
    };
    var Freq=200;
    for(let i=0;i<analogSensors.length;i++){
        analogSensors[i].freq=Freq;
        analogSensors[i].on("change",function () {
            sensorsData["senA"+i]=analogSensors[i].value;
        })
    }

    //标准
    // var sena0=new five.Sensor("A0");
    // sena0.freq=Freq;
    // sena0.on("change",function () {
    //     sensorsData.senA0=sena0.value;
    // });
    // var sena1=new five.Sensor("A1");
    //     sena1.freq=Freq;
    // sena1.on("change",function () {
    //    sensorsData.senA1=sena1.value;
    // });

    // for (let i=0;i<digitalSensors.length;i++){
    //     digitalSensors[i].freq=Freq;
    // }
    setInterval(function () {
        sio.sockets.emit("sensorDataUpdate",sensorsData);
    },Freq);

});