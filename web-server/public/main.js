$(function() {
  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  // Initialize variables
  var $window = $(window);
  var $userNameInput = $('#userNameInput'); // Input for userName
  var $roomNameInput = $('#roomNameInput'); // Input for userName
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message input box

  var $loginPage = $('.login.page'); // The login page
  var $chatPage = $('.chat.page'); // The chatroom page

  // Prompt for setting a userName
  var userName;
  var connected = false;
  var typing = false;
  var lastTypingTime;
  var $currentInput = $userNameInput.focus();

  var pomelo = window.pomelo;
  var host = "127.0.0.1";
  var port = "3014";
  var onConnected = function() {
    var onReturned = function(data) {};
    const rr = "gate.entryHandler.entry";
    pomelo.request(rr, "hello pomelo", onReturned);
  };
  pomelo.init({
    host: host,
    port: port,
    log: true
  }, onConnected);

  function addParticipantsMessage(data) {
    var message = '';
    if (data.numUsers === 1) {
      message += "there's 1 participant joined room:" + data.roomName;
    } else {
      message += "there are " + data.numUsers + " participants joined room:" + data.roomName;
    }
    log(message);
  }

  // Sets the client's userName
  function setUsername() {
    userName = cleanInput($userNameInput.val().trim());
    roomName = cleanInput($roomNameInput.val().trim());

    // If the userName is valid
    if (userName && roomName) {
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');
      $currentInput = $inputMessage.focus();
      // Socket events

      // Whenever the server emits 'login', log the login message
      const login = 'gate.entryHandler.add';
      var onReturned = function(data) {
        if (data.retCode == 1000) {
          var message = "Welcome to Socket.IO Chat – ";
          log(message, {
            prepend: true
          });
          connected = true;
          addParticipantsMessage(data);
        }
        alert(JSON.stringify(data));
      };
      //login to Room
      pomelo.request(login, {
        userName: userName,
        roomName: roomName
      }, onReturned);

      // Whenever the server emits 'new message', update the chat body
      pomelo.on('onChat', function(data) {
        console.log('onChat receive data is ', data);
        addChatMessage(data);
      });

      // Whenever the server emits 'user joined', log it in the chat body
      pomelo.on('user joined', function(data) {
        log(data.userName + ' joined');
        addParticipantsMessage(data);
      });

      // Whenever the server emits 'user left', log it in the chat body
      pomelo.on('user left', function(data) {
        log(data.roomName + ' left');
        //socket.emits('user left', userName, roomName);
        addParticipantsMessage(data);
        removeChatTyping(data);
      });

      // Whenever the server emits 'typing', show the typing message
      pomelo.on('typing', function(data) {
        addChatTyping(data);
      });

      // Whenever the server emits 'stop typing', kill the typing message
      pomelo.on('stop typing', function(data) {
        removeChatTyping(data);
      });

      pomelo.on('disconnect', function() {
        log('you have been disconnected');
        var leave = 'gate.entryHandler.leave';
        ;
        var onLeaveReturned = function() {
          console.log('leave');
        }
        pomelo.request(leave, {
          roomName: roomName
        }, onLeaveReturned);
      });

      pomelo.on('reconnect', function() {
        log('you have been reconnected');
        if (userName) {
          //socket.emit('add user', userName);
          pomelo.request(login, {
            userName: userName,
            roomName: roomName
          }, onReturned);
        }
      });

      pomelo.on('reconnect_error', function() {
        log('attempt to reconnect has failed');
      });

      pomelo.on('ready', function(data) {
        log(data);
      })

      pomelo.on('start', function(data) {
        log(data);
      })

      pomelo.on('end', function(data) {
        log(data);
      })
    } else {

    }
  }

  // Sends a chat message
  function sendMessage() {
    console.log('send Message');
    var message = $inputMessage.val();
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message && connected) {
      $inputMessage.val('');
      // addChatMessage({
      //   userName: userName,
      //   message: message
      // });
      // tell server to execute 'new message' and send along one parameter
      const send = 'gate.entryHandler.send';
      var onReturned = function(data) {};
      pomelo.request(send, message, onReturned);
    }
  }

  // Log a message
  function log(message, options) {
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el, options);
  }

  // Adds the visual chat message to the message list
  function addChatMessage(data, options) {
    // Don't fade the message in if there is an 'X was typing'
    var $typingMessages = getTypingMessages(data);
    options = options || {};
    if ($typingMessages.length !== 0) {
      options.fade = false;
      $typingMessages.remove();
    }

    var $userNameDiv = $('<span class="userName"/>')
      .text(data.userName)
      .css('color', getUsernameColor(data.userName));
    var $messageBodyDiv = $('<span class="messageBody">')
      .text(data.message);

    var typingClass = data.typing ? 'typing' : '';
    var $messageDiv = $('<li class="message"/>')
      .data('userName', data.userName)
      .addClass(typingClass)
      .append($userNameDiv, $messageBodyDiv);

    addMessageElement($messageDiv, options);
  }

  // Adds the visual chat typing message
  function addChatTyping(data) {
    data.typing = true;
    data.message = 'is typing';
    addChatMessage(data);
  }

  // Removes the visual chat typing message
  function removeChatTyping(data) {
    getTypingMessages(data).fadeOut(function() {
      $(this).remove();
    });
  }

  // Adds a message element to the messages and scrolls to the bottom
  // el - The element to add as a message
  // options.fade - If the element should fade-in (default = true)
  // options.prepend - If the element should prepend
  //   all other messages (default = false)
  function addMessageElement(el, options) {
    var $el = $(el);

    // Setup default options
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    // Apply options
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

  // Prevents input from having injected markup
  function cleanInput(input) {
    return $('<div/>').text(input).html();
  }

  // Updates the typing event
  function updateTyping() {
    if (connected) {
      if (!typing) {
        typing = true;
      //socket.emit('typing');
      }
      lastTypingTime = (new Date()).getTime();

      setTimeout(function() {
        var typingTimer = (new Date()).getTime();
        var timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
          //socket.emit('stop typing');
          typing = false;
        }
      }, TYPING_TIMER_LENGTH);
    }
  }

  // Gets the 'X is typing' messages of a user
  function getTypingMessages(data) {
    return $('.typing.message').filter(function(i) {
      return $(this).data('userName') === data.userName;
    });
  }

  // Gets the color of a userName through our hash function
  function getUsernameColor(userName) {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < userName.length; i++) {
      hash = userName.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

  // Keyboard events

  $window.keydown(function(event) {
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (userName) {
        sendMessage();
        //socket.emit('stop typing');
        typing = false;
      } else {
        setUsername();
      }
    }
  });

  $inputMessage.on('input', function() {
    updateTyping();
  });

  // Focus input when clicking on the message input's border
  $inputMessage.click(function() {
    $inputMessage.focus();
  });

});
