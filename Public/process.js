//ar socket = io("http://localhost:3000");
var socket = io("https://dongchat.herokuapp.com");

//Client lắng nghe các sự kiện server trả về
    socket.on("server-send-failed-register",function(){
        alert("Đăng ký thất bại ! Tên đã được sử dụng !");
    });

    socket.on("server-send-success-register",function(data){
        $("#currentUser").html(data);
        $("#loginForm").hide(2000);
        $("#chatForm").show(1000);
    });

    socket.on("server-send-list-users",function(data){
        $("#boxContent").html("");
        //lặp mảng trong js
        data.forEach(function(i){
            $("#boxContent").append("<div class='user'>"+i+"</div>");
        });
        
    });

    socket.on("Server-send-messages",function(data){
        $("#listMessages").append("<div class='ms'>"+data.userName+" :  "+data.conTent+"</div>");
    });

$(document).ready(function(){
    $("#loginForm").show();
    $("#chatForm").hide();
    
    //khi khách hàng đăng ký tên chat lên server
    $("#btnRegister").click(function(){
        // khi user nhập tên và đăng ký thì emit tên lên server
        if(document.getElementById("txtUsername").value != ""){
            socket.emit("Client-send-Username",$("#txtUsername").val());
        }else{
            alert("Hãy nhập tên WeChat của bạn !!");
        }
        
    });

    //khi khách hàng logout khỏi khung chat
    $("#btnLogout").click(function(){
        socket.emit("logout");
        $("#chatForm").hide(2000);
        $("#loginForm").show(1000);
    });

    //khi user nhấn nút send
    $("#btnSendMessage").click(function(){
        socket.emit("User-send-messages",$("#txtMessages").val());
        $("#txtMessages").html("");
    });
});