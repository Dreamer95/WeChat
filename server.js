// BUILD WEB REAL-TIME CHAT - SERVER
// Cấu hình Server Node JS kết hợp EJS và Socket.io
var express = require("express");
var app = express();
// sử dụng thư mục puclic là static -> tất cả client đều sử dụng đc
app.use(express.static("Public"));
app.set("view engine","ejs");//thiết lập view engine 
app.set("views","./Views");//thiết lập thư mục chứ views


var server = require("http").Server(app);//tạo server
var io = require("socket.io")(server);
server.listen(process.env.PORT || 3000); // server hoạt động tại port 3000

/* Server lắng nghe sự kiện
Mỗi 1 client connect tới Server sẽ đc tạo 1 socket với id riêng
để quản lý ! thông qua lắng nghe event connection
*/ 
//mảng lưu danh sách username
var arrUsers=[];
//mảng lưu danh sách học viên gửi về
var mang = [];
// tạo class trong js thì dùng function
function HocVien(hoten,email,phone){
    this.HOTEN = hoten;
    this.EMAIL = email;
    this.SODT = phone;
};

io.on("connection",function(socket){
    // bắt kết nối
    console.log("Có người kết nối : " + socket.id);
    //khi client ngắt kết nối thì server cũng biết
    socket.on("disconnect",function(){
        console.log(socket.id + " đã ngắt kết nối");
        arrUsers.splice(
            arrUsers.indexOf(socket.Username),1
        );
        socket.broadcast.emit("server-send-list-users",arrUsers);
    });
    
    socket.on("Client-send-Username",function(data){
        console.log("user "+socket.id +" đăng ký tên: "+data.ten);
        // if(arrUsers.indexOf(data)>=0){
        //     //nếu tìm thấy tên trong mảng thì dk thất bại
        //     socket.emit("server-send-failed-register");
        // }

        //kiểm tra xem tên ng dùng đăng ký đã tồn tại chưa
        const isExist = arrUsers.some(function(e){
            e.ten == data.ten;
        })
        if(isExist){
            //nếu tìm thấy tên trong mảng thì dk thất bại
            socket.emit("server-send-failed-register");
        }
        else{
            arrUsers.push(data); //add tên của user vào mảng
            socket.Username = data.ten; // tạo thêm thuộc tính 
            socket.emit("server-send-success-register",data)
            io.sockets.emit("server-send-list-users",arrUsers);

        }
    });

    socket.on("logout",function(){
        //cắt user logout ra khỏi mảng
        arrUsers.splice(
            arrUsers.indexOf(socket.Username),1
        );
        //phát cho những user còn lại
        socket.broadcast.emit("server-send-list-users",arrUsers);

    })

    socket.on("User-send-messages",function(data){
        /*khi nhận message từ user, server sẽ trả về cho
        toàn bộ client - truyền chuỗi Json về*/
        io.sockets.emit("Server-send-messages",{userName: socket.Username, conTent: data });
    });

    socket.on("hocvien-gui-thongtin",function(data){
        //push thông tin sinh viên gửi lên vào mang
        mang.push (
            new HocVien(data.hoten,data.email,data.phone)
        )
        console.log(data.phone)
        io.sockets.emit("server-gui-ds",mang)
    });

    // web rtc
    socket.on("User-Send-peerID",function(data){
        console.log(data);
    })

   
}); 

//routing trang trả về client
/* Dấu xuyệt / là địa chỉ : localhost:3000/ */
app.get("/",function(request,response){
    response.render("index");
});

app.get("/dong",function(req,res){
    res.render("dong")
})