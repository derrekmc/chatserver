function CordovaBox(host, token, options){

    if(!io) return 'Socket.io not loaded. Cannot initialize.';
    if(!host) return 'Host not provided. Unable to connect.';
    if(!token) return 'No token passed for authentication. Unable to authenticate.';

    this.options = options || {};
    this.options.host = host;
    this.options.token = token;
    this.options.query += "&token=" + token;
    var self = this;

    this.socket = io.connect(host, {query: options});

    /**
     * todo use ui referenes from front end for below maps
     * @type {*|{chat: {event: {message: string, addUser: string, removeUser: string, blockUser: string}, ui: {name: string, input: string, message_log: string, sendInputButton: string, userList: string}}, video: {event: {publishing: string, status: string, name: string}, ui: {name: string, status: string, publishing: string}}}}
     * @private
     */

    /***
     * Request a user to be blocked
     * @param name
     * @param id
     */
    this.sendBlock = function(name, id) {
        self.socket.emit('user.block', {name: name, id: id});
    };

    this.sendMessage = function(msg) {
        if(msg == '') return;
        console.log(msg);
        self.socket.emit('message', {
            name: name,
            value: msg,
            type: clientType,
            id: clientId
        });
        console.log(options.messageLog);
        $(options.messageLog).val('');
    };

     this.logChat = function(message, type) {
        console.log(message, type);
        var li = $('<li />').text(message);
        li.addClass('clientTypeFont_' + type);
        $(options.messageLog).prepend(li);
    };

    /**
     *************** Start Socket Events *****************
     */

    self.socket.on('message', function (data) {
        console.log("data" + data);
        self.logChat(data.name + ": " +  data.value, data.type);

    });

    self.socket.on('connect', function (data) {

        console.log('  --------------   ');
        console.log(" |              |  ");
        console.log(" |  CordovaBox  |  ");
        console.log(" |     .io      |  ");
        console.log(" |              |  ");
        console.log("  --------------   ");

        console.log(" --|= Web socket connect connection established.");

        self.logChat('Connected to chat room ', 'system', data);

    });

    self.socket.on('disconnect', function (data) {
        self.logChat(data.value, 'leave');
    });



    self.socket.on('error', function (data) {
        self.logChat(data, 'error');
    });

    /**
     *************** End Socket Events *****************
     */

    jQuery(document).ready(function () {
        console.log("options.messageInput:" + options.messageInput);
        $(options.messageInput).keypress(function (event) {
            console.log("options.messageInput:" + options.messageInput);
            if (event.which == 13) {
                console.log("options.messageInput:" + options.messageInput);
                var msg = $(options.messageInput).val();
                self.sendMessage(msg);
            }
        });

        $(options.messageSendButton).click(function () {
            self.logChat('messageSendButton');
            var msg = $(options.messageSendButton).val();
            self.sendMessage(msg);
        });

    });
}