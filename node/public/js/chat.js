var me = {};

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}            

function insertChat(who, text, time = 0){
    var control = "";
    var space = "";
    var date = formatAMPM(new Date());
    if (who == "me"){        
        control = '<li style="width:70%; background-color: white; float: right; margin-right: 10px; box-sizing: border-box; padding: 5px">' +
                    '<p>'+text+'</p>' +
                    '<p><small>'+date+'</small></p>' +               
                  '</li>';
        space = '<li style="width:70%; background-color: none; float: right; margin-right: 10px; box-sizing: border-box; padding: 5px; margin-top: 5px; margin-bottom: 5px">' +
                    '<p>' + '</p>' +
                    '<p><small>' + '</small></p>' +
                '</li>'
    }
    setTimeout(
        function(){
            $(".messages").append(control);
            $(".messages").append(space);
        }, time);
}

$(".mytext").on("keyup", function(e){
    if (e.which == 13){
        var text = $(this).val();
        if (text !== ""){
            insertChat("me", text);              
            $(this).val('');
        }
    }
});
$('.send_message').click(function (e) {
    var text = $(".mytext").val();
        if (text !== ""){
            insertChat("me", text);              
            $(".mytext").val('');
        }
});
