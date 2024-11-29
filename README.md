# Project Documentation

Live link: [https://cheery-tarsier-36a350.netlify.app/](https://cheery-tarsier-36a350.netlify.app/)

## Usage Limitation
Currently limited to answering only **100 queries**. Once this limit is reached, it will no longer be able to provide responses. 

## DOM Elements
These elements are selected using `document.querySelector` or `document.getElementById` and are used throughout the script for user interactions.

- `docField`: File input field for selecting documents.
- `button`: Button for triggering file upload.
- `filesField`: Container for displaying uploaded files.
- `refreshBtn`: Button to refresh the file list.
- `chatField`: Input field for typing chat messages.
- `chatButton`: Button for sending chat messages.
- `chatContainer`: Container for displaying chat messages.
- `chatHistory`: Element that toggles chat history view.
- `toggleChat`: Button to toggle chat history visibility.
- `chatHistoryList`: Container for displaying the list of past chats.
- `newChat`: Button to start a new chat.

## Configuration
These are the variables used for API interactions and maintaining state.

- `authToken`: Authentication token used in API requests.
- `folderId`: ID of the folder where files are stored.
- `botId`: ID of the bot for creating and managing chats.
- `HEADERS`: Request headers for authentication.
- `chats`: Stores the messages in the current conversation.
- `chosenChat`: Holds the current chat conversation object.

## File Management Functions

### `uploadFile()`
Uploads a file to the server.

1. Fetches a signed URL for the file upload.
2. Uploads the file to the signed URL.
3. Finalizes the upload by registering the file in the system.

### `getFiles()`
Fetches the list of files from the server.

### `removeFile(fileId)`
Deletes a file from the server.

### `renderFiles(files)`
Renders the list of uploaded files in the UI.

## Chat Management Functions

### `createConversation(name)`
Creates a new chat conversation with the bot.

### `getConversations()`
Fetches all available conversations.

### `deleteConversation(conversationId)`
Deletes a conversation from the system.

### `displayConversations(history)`
Displays the list of conversations in the UI.

### `getMessages(conversationId)`
Fetches the list of messages for a given conversation.

### `displayMessages()`
Displays the messages of the current conversation in the UI.

### `startNewChat()`
Starts a new chat, clearing the current conversation.

### `answerQuestion(question)`
Sends a question to the bot and adds the response to the conversation.

### `sendChat()`
Handles sending the chat message to the bot.

## Event Listeners

### File Upload and Refresh

- `button.addEventListener("click")`: Triggers file upload if a file is selected.
- `refreshBtn.addEventListener("click")`: Refreshes the list of files by fetching from the server.

### Chat Interaction

- `toggleChat.addEventListener("click")`: Toggles the visibility of the chat history.
- `chatButton.addEventListener("click")`: Sends the chat message entered in the chat input field.
- `newChat.addEventListener("click")`: Starts a new chat.

### On Page Load

- `document.addEventListener("DOMContentLoaded")`: Fetches and renders files and conversations when the page is loaded.
