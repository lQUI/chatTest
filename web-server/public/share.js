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
  var $inviteCodeInput = $('#inviteCodeInput');
  var $enter = $('#enter');
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message input box

  var $loginPage = $('.login.page'); // The login page
  var $chatPage = $('.chat.page'); // The chatroom page

  // Prompt for setting a userName
  var userName;
  var roomId;
  var connected = false;
  var typing = false;
  var lastTypingTime;
  var $currentInput = $inviteCodeInput.focus();

  var socket = null;

  function addParticipantsMessage(data) {
    var message = '';
    if (data.numUsers === 1) {
      message += "只有一个人在房间" ;
    } else {
      message += "有 " + data.numUsers + " 玩家在房间";
    }
    log(message);
  }
  function genPlayerName() {
    var str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var randomName = "";
    for (let i = 0; i < 5; i++) {
      let rand = Math.floor(Math.random() * str.length);
      randomName += str.charAt(rand);
    }
    return randomName;
  }
  // Sets the client's userName
  function setUsername() {

    inviteCode = cleanInput($inviteCodeInput.val().trim());
    userName = cleanInput($userNameInput.val().trim());
    //userName = genPlayerName();; 
    roomId = cleanInput($roomNameInput.val().trim());
    console.log(roomId, 'roomId');
    // If the userName is valid
    if (userName && roomId) {
      $.ajax({
        url: "http://localhost:3000/v1/chatRoom/" + roomId,
        type: 'get',
        data: {
          'userName': userName,
          'roomId': roomId,
          'inviteCode': inviteCode
        },
        contentType: 'application/x-www-form-urlencoded',
        success: function(result) {
          console.log(result);
          if (result.ret == 1000) {
            socket = io("/chatRoom/" + roomId);
            $loginPage.fadeOut();
            $chatPage.show();
            $loginPage.off('click');
            $currentInput = $inputMessage.focus();
            // Socket events

            // Whenever the server emits 'login', log the login message
            socket.on('login', function(data) {
              connected = true;
              // Display the welcome message
              var message = "－欢迎加入游戏室 – ";
              log(message, {
                prepend: true
              });
              addParticipantsMessage(data);
            });

            // Whenever the server emits 'new message', update the chat body
            socket.on('new message', function(data) {
              addChatMessage(data);
            });

            // Whenever the server emits 'user joined', log it in the chat body
            socket.on('user joined', function(data) {
              log(data.userName + ' 加入游戏');
              addParticipantsMessage(data);
            });

            // Whenever the server emits 'user left', log it in the chat body
            socket.on('user left', function(data) {
              log(data.userName + '离开房间')
              addParticipantsMessage(data);
              removeChatTyping(data);
            });

            // Whenever the server emits 'typing', show the typing message
            socket.on('typing', function(data) {
              addChatTyping(data);
            });

            // Whenever the server emits 'stop typing', kill the typing message
            socket.on('stop typing', function(data) {
              removeChatTyping(data);
            });

            socket.on('disconnect', function() {
              log('you have been disconnected');
            });

            socket.on('reconnect', function() {
              log('you have been reconnected');
              if (userName) {
                socket.emit('login', userName, result.playerId);
              }
            });

            socket.on('reconnect_error', function() {
              log('attempt to reconnect has failed');
            });

            socket.on('defaults', function(data) {
              alert(data);
              location.reload();
            });

            socket.on('ready', function(data) {
              log(data);
            })

            socket.on('start', function(data) {
              log(data);
            })
            // Tell the server your userName
            socket.emit('login', userName, result.playerId);
          } else {
            alert('邀请码错误');
            location.reload()
          }
        }
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
      addChatMessage({
        userName: userName,
        message: message
      });
      // tell server to execute 'new message' and send along one parameter
      socket.emit('new message', message);
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
      .text(data.userName + ':')
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
        socket.emit('typing');
      }
      lastTypingTime = (new Date()).getTime();

      setTimeout(function() {
        var typingTimer = (new Date()).getTime();
        var timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
          socket.emit('stop typing');
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
    if (userName != null && userName != undefined) {
      for (var i = 0; i < userName.length; i++) {
        hash = userName.charCodeAt(i) + (hash << 5) - hash;
      }
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
        socket.emit('stop typing');
        typing = false;
      } else {
        setUsername();
      }
    }
  });

  $enter.click(function(event) {
    if (userName) {
      sendMessage();
      socket.emit('stop typing');
      typing = false;
    } else {
      setUsername();
    }
  })

  $inputMessage.on('input', function() {
    updateTyping();
  });

  // Click events


  // Focus input when clicking on the message input's border
  $inputMessage.click(function() {
    $inputMessage.focus();
  });


});
