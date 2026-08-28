## SEND MESSAGE
1. Input message and type send btn
2. handleSendMessage function put all the data which are necessary to store message in database inside formData object and call the sendMessage function
3. sendMessage function extract all the data from formData object and create a temporary message to quickly show message on sender side conversation view and then call api to save message to database and update conversation lastMessage and unreadCount properties on the same api call and after saving database replace temporary message with real one and since i change messages state here thats why users are fetch in HomePage component which populate conversations data and chatList component is getting updated with new lastMessage and unreadCount and after replace temporary message with real one emit send_message event with real message obj
4. from server side socketly catch the send_message event and get the receiverid from the msg obj and trigger receive_message event to the receiver socket
5. receiver catch the receive_message event and call the receiveMessage function 
6. inside receiveMessage function we check that is receiver is on same conversation then set message into messages state since messages state changed users fetched in HomePage component and chatList component will rerendered with new lastMessage and unreadCount data and then call markMessagesAsRead function and for all cases set conversation lastMessage and unreadCount since conversations state updated fetchMessages will call inside useEffect in ChatWindow page and fetchMessages function set messages and messages state update fetch users data and re-render ChatList page with updated lastMessage and unreadCount

## User Typing
1. sender typing message on input onChange event listener on input update message state on ChatWindow page and call startTyping inside useEffect from ChatWindow page 
2. startTyping function emit typing_start event 
3. server side user socket will catch typing_start event and run the handler where typingUsers map will updated and user_typing event will emit to notify receiver and implement Auto-stop typing after 3 seconds using setTimeOut
4. receiver catch the user_typing event and call the handler to update typingUsers map inside chatStore
5. since i was subscribe typingUsers state in ChatWindow page so page will re-render and we will see typing...

## User Status
1. When user connect or disconnect server side socket connection of the user fire user_connected or disconnect event this are inbuilt events which are fire by socket himself inside the handler of the event user_status event emit for all users connected to the server
2. client side socket catch the user_status event and add the user in the onlineUsers state
3. since onlineUsers state is subscribed in the ChatWindow page so the component re-rendered and update the UI with current user status

## Delete Message
1. By clicking on delete btn on message, deleteMessage function will call
2. Inside deleteMessage function we make api call to delete the message from db only if sender delete his/her own message and emit message_deleted event to notify the receiver and set the updated messages in messages state
3. message_deleted event handler set updated messages and since messages state is update and ChatWindow component subscribed messages state so ChatWindow component will re-render and show the updated messages on chat window

### Message Status Update
1. When user open a contact then that conversation related all messages are fetched from database inside fetchMessages function we call markMessagesAsRead function or sender send message and receiver is also on the same conversation then receiveMessage function will call inside receive_message event handler and form the receiveMessage request body we call markMessagesAsRead function
2. Inside markMessagesAsRead function we make a api call to mark unread messages as read in database and Notify original sender by emit message_read event, and update messages state
3. Sender client side socket catch the message_read event and update messages in messages state