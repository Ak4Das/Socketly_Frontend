## User Status

1. When user connect or disconnect server side socket connection of the user fire user_connected or disconnect event this are inbuilt events which are fire by socket itself inside the handler of the event user_status event emit for all users connected to the server
2. client side socket catch the user_status event and add or remove the user in the onlineUsers state
3. since onlineUsers state is subscribed in the ChatWindow page so the component re-rendered and update the UI with current user status

## User Typing

1. sender typing message on input, onChange event listener on input update message state on ChatWindow page and call startTyping inside useEffect from ChatWindow page
2. startTyping function emit typing_start event
3. server side user socket will catch typing_start event and run the handler where typingUsers map will updated and user_typing event will emit to notify receiver and implement Auto-stop typing after 3 seconds using setTimeOut
4. receiver catch the user_typing event and call the handler to update typingUsers map inside chatStore
5. since i was subscribe typingUsers state in ChatWindow page so page will re-render and we will see typing...

## Send Message

1. Input message and type send btn
2. handleSendMessage function put all the data which are necessary to store message in database inside formData object and call the sendMessage function
3. sendMessage function extract all the data from formData object and create a temporary message to quickly show message on sender side conversation view and then call api to save message to database
4. sendMessage controller in backend save the message to database and update conversation lastMessage and unreadCount properties after that emit receive_message event to the receiver socket
5. api send response and sendMessage function in frontend side replace temporary message with real one and since i change messages state here thats why users are fetch in HomePage component which populate conversations data and chatList component is getting updated with new lastMessage and unreadCount
6. receiver catch the receive_message event and call the receiveMessage function
7. inside receiveMessage function we check that is receiver is on same conversation then set message into messages state and then call markMessagesAsRead function and for all cases set conversation lastMessage and unreadCount since conversations state updated fetchMessages will call inside useEffect in ChatWindow page and fetchMessages function set messages and messages state update fetch users data and re-render ChatList page with updated lastMessage and unreadCount

## Message Status Update

1. when sender send message then by default message status is send
2. if receiver is in online then sendMessage controller in backend during sending message check if the receiver is in online or not if online then change the message status as delivered and save the message
3. if the receiver is not in online then message status is send and save to database when receiver gets online then inside the event handler of user_connected event we update send message status as delivered only for those messages who's receiver is the connecting user and current message status is send
4. When user open a contact then that conversation related all messages are fetched from database inside fetchMessages function we call markMessagesAsRead function or sender send message and receiver is also on the same conversation then receiveMessage function will call inside receive_message event handler and form the receiveMessage request body we call markMessagesAsRead function
5. Inside markMessagesAsRead function we make a api call to mark unread messages as read in database and Notify original sender by emit message_read event, and update messages state
6. Sender client side socket catch the message_read event and update messages in messages state
7. But if user already in the same conversation and sender send the message then during the sending message process when user gets receive_message event inside the event handler
   we call markMessageAsRead function to change the message status as read and and save the message in database then message_read event update the sender side message state

## Reaction on Messages Update

1. By selecting a emoji on message handleReaction function in ChatWindow page will call and inside handleReaction function addReaction will call
2. Inside addReaction function add_reaction event will emit and server side add_reaction event handler will call
3. Inside handler save message reaction in the DB and after that emit reaction_update event for both sender and receiver
4. Inside reaction_update event handler i add reaction into message object and update messages state

## Delete Message

1. By clicking on delete btn on message, deleteMessage function will call
2. Inside deleteMessage function we make api call to delete the message from db
3. Backend side deleteMessage handler delete the message only if sender delete his/her own message if message is image/video/audio/document then first delete the message from cloudinary or drive then delete message from db and emit message_deleted event to notify the receiver
4. once api send response, deleteMessage function in frontend side set the updated messages in messages state
5. message_deleted event handler set updated messages in the receiver side and since messages state is update and ChatWindow component subscribed messages state so ChatWindow component will re-render and show the updated messages on chat window

## Full flow in to out

1. When user successfully login user will arrive to home page with sidebar and chatList when user select any contact from chatList then setSelectedContact action will call and it update state inside layoutStore and whatever component subscribe selectedContact state will re-render so layout component will rerender and chatWindow will open for the selected contact after that conversation will fetch which is associated with that particular contact and all messages are fetch which are associated with that particular conversation
2.
