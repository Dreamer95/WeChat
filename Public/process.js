//var socket = io("http://localhost:3000");
var socket = io("https://ngocdong.herokuapp.com");

//Client lắng nghe các sự kiện server trả về
    socket.on("server-send-failed-register",function(){
        alert("Đăng ký thất bại ! Tên đã được sử dụng !");
    });

    socket.on("server-send-success-register",function(data){
        $("#currentUser").html(data.ten);
        $("#loginForm").hide(2000);
        $("#chatForm").show(1000);
    });

    socket.on("server-send-list-users",function(data){
        $("#boxContent").html("");
        //lặp mảng trong js
        data.forEach(function(user){
            const {ten, peerID} = user;
            $("#boxContent").append(`<li id="${peerID}">${ten}</li>`);
        });
        
    });

    socket.on("Server-send-messages",function(data){
        $("#listMessages").append("<div class='ms'>"+data.userName+" :  "+data.conTent+"</div>");
    });

    socket.on("server-gui-ds",function(data){
        $("#ds").html("")
        data.map(function(hocvien,index){
            //alert(hocvien.HOTEN)
            $("#ds").append(
                `<h4> <div class='hocvien'>
                    <div class='hang1'>id: `+ index +`||<span>`+hocvien.HOTEN+`</span></div>
                    <div class='hang2'>`+hocvien.EMAIL+`-`+hocvien.SODT+`</div>
                </div> </h4>`  
            )
        })
    })

    // java script cho web rtc
    function openStream(){
        const config = {audio:false, video:true};
        return navigator.mediaDevices.getUserMedia(config);
    }
    
    function playStream(idVideoTag, stream){
        const video = document.getElementById(idVideoTag);
        video.srcObject = stream;
        video.play();
    }

    var peer = new Peer({key: 'lrfifuxbxsdu0udi'});
    // peer.on('open',id => $('#my-peer').append(id));
    //let PeerID;
    peer.on('open',function(id){
            //console.log(id);
            $('#my-peer').append(id);
            //peerID = id;
            socket.emit("User-Send-peerID",id);
            $("#btnRegister").click(function(){
                // khi user nhập tên và đăng ký thì emit tên lên server
                if(document.getElementById("txtUsername").value != ""){
                    const userName = $("#txtUsername").val();
                    //socket.emit("Client-send-Username",$("#txtUsername").val());
                   socket.emit("Client-send-Username",{ten: userName, peerID : id});
                }else{
                    alert("Hãy nhập tên WeChat của bạn !!");
                }       
            });
        })

    $('#btnCall').click(()=>{
        console.log("ban da click button")
        const id = $('#remoteId').val();
        console.log(id);
        openStream().then(stream=>{
            playStream('localStream',stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream => playStream('remoteStream',remoteStream));
        })
    })

    peer.on('call',call => {
        openStream().then(stream => {
            call.answer(stream);
            playStream('localStream', stream);
            call.on('stream', remoteStream => playStream('remoteStream',remoteStream));
        })
    })

    
    //--------------------------------------------------------------------------------------------------

$(document).ready(function(){
    $("#loginForm").show();
    $("#chatForm").hide();
    
    //khi khách hàng đăng ký tên chat lên server
    // $("#btnRegister").click(function(){
    //     // khi user nhập tên và đăng ký thì emit tên lên server
    //     if(document.getElementById("txtUsername").value != ""){
    //         const userName = $("#txtUsername").val();
    //         socket.emit("Client-send-Username",$("#txtUsername").val());
    //        //socket.emit("Client-send-Username",{ten: userName, peer_ID = PeerID});
    //     }else{
    //         alert("Hãy nhập tên WeChat của bạn !!");
    //     }       
    // });

      // sau khi kết nối đc với peer thì mới lăng nghe sự kiện đăng ký
    //   peer.on('open',function(id){
    //     //console.log(id);
    //     $('#my-peer').append(id);
    //     $("#btnRegister").click(function(){
    //         // khi user nhập tên và đăng ký thì emit tên và peerId lên server
    //         const userName = $("#txtUsername").val();
    //         if(document.getElementById("txtUsername").value != ""){
    //             socket.emit("Client-send-Username",{ten: userName, peerID = id});
    //         }else{
    //             alert("Hãy nhập tên WeChat của bạn !!");
    //         }           
    //         });
    //     })
    //khi khách hàng logout khỏi khung chat
    $("#btnLogout").click(function(){
        socket.emit("logout");
        $("#chatForm").hide(2000);
        $("#loginForm").show(1000);
    });

    //khi user nhấn nút send
    $("#btnSendMessage").click(function(){
        socket.emit("User-send-messages",$("#txtMessages").val());
        $("#txtMessages").val("");
    });

    $("#btnRes").click(function(){
        socket.emit("hocvien-gui-thongtin",{
            hoten:$("#txtHoten").val(),
            email:$("#txtEmail").val(),
            phone:$("#txtSoDT").val()
        });
    });

    $('#boxContent').on('click','li',function(){
        console.log($(this).attr("id"));
        const id = $(this).attr("id");
        openStream().then(stream=>{
            playStream('localStream',stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream => playStream('remoteStream',remoteStream));
        })
    })
});