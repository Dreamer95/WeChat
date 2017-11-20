function openStream(){
    const config = {audio:false, video:true};
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream){
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

// openStream().then(stream => playStream('localStream',stream));

var peer = new Peer({key: 'lrfifuxbxsdu0udi'});
// peer.on('open',id => $('#my-peer').append(id));
peer.on('open',function(id){
    //console.log(id);
    $('#my-peer').append(id);
})
//Caller
// $('#btnCall').click(function(){
//     var id = $('#remoteId').val();
//     openStream().then(function(stream){
//         playStream('localStream',stream);
//         const call = peer.call(id, stream);
//         call.on('stream',function(remoteStream){
//             playStream('remoteStream', remoteStream);
//         });
//     });
// });
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
//Callee
// peer.on('call', function(call){
//     openStream().then(function(stream){
//         call.answer(stream);
//         playStream('localStream',stream);
//         call.on('stream',function(remoteStream){
//             playStream('remoteStream',remoteStream);
//         })
//     })
// })
peer.on('call',call => {
    openStream().then(stream => {
        call.answer(stream);
        playStream('localStream', stream);
        call.on('stream', remoteStream => playStream('remoteStream',remoteStream));
    })
})