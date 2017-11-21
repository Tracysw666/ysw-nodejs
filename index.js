//express_demo.js 文件
var express = require('express');
var app = express();
var fs = require("fs");
var mysql      = require('mysql');

var url = require("url");
var queryString  = require("querystring");

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


var connection = mysql.createConnection({
    host     : '60.205.218.42',
    user     : 'root',
    password : '123456',
    database : 'ysw'
});

connection.connect();


//加双引号的方法  (员数组,需要加的键名)
function addQuotes(list,needaddQuotesList){
    for(li in list){
        for(var i = 0;i<needaddQuotesList.length;i++){
            if(li == needaddQuotesList[i]){
                list[li] = '"'+list[li]+'"';
            }
        }

    }
    return list;

}


/**登录**/
app.post('/login', function (req, res) {
    console.log(req.body);
    var loginList = req.body;
    if(!loginList.username||!loginList.password){
        return res.json({message:"请填写完整信息",code:-1});
    }else {
        loginList = addQuotes(loginList,['username']);
        var  login = 'SELECT * FROM user where username='+loginList.username;
        console.log(login);
        connection.query(login,function (err, result) {
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
                return;
            }
            console.log(result);
            console.log("密码是2"+loginList.password);

            if(result.password == loginList.password) {
                delete result.password;
                res.json({code: 0,data:result, message: "登录成功"});
            }else {
                res.json({code: -1, message: "密码错误,请检查账户或密码是否填写正确"});

            }
        });

    }
});


/**注册**/
app.post('/register', function (req, res) {
    console.log(req.body);
    var userList = req.body;




    if(!userList.username||!userList.password||!userList.phone||!userList.address||!userList.getGoodsName){
        return res.json({message:"请填写完整信息",code:-1});
    }else {
       userList = addQuotes(userList,['username','password','address',getGoodsName])
        //


        var  register = 'insert into user(username,password,phone,address,getGoodsName) values'+"("+userList.username+","+userList.password+","+userList.phone+","+userList.address+","+userList.getGoodsName+")";
    console.log(register)
        connection.query(register,function (err, result) {
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
                return;
            }
            res.json({code:0,message:"注册成功"});
        });

    }
});


/**获取化妆品列表**/
app.get('/getCosmeticsList', function (req, res) {
    //化妆品的table
    var  cosmeticsListTable = 'SELECT * FROM cosmetics';
    connection.query(cosmeticsTable,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
        res.json(result);
    });
});

/**获取化妆品详情**/
app.get('/getCosmeticsDetail', function (req, res) {
    var proId = url.parse(req.url, true).query.proid;
    if(!proId){
        res.json({message:"请输入id"});

        return false;
    }
    var  cosmeticsDetailTable = 'SELECT * FROM cosmetics where proid='+proId;
    connection.query(cosmeticsDetailTable,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
        res.json(result);
    });
});


var server = app.listen(8721, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
})