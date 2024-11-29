// DOM Elements
const docField = document.querySelector("#doc");
const button = document.querySelector("#button");
const filesField = document.querySelector(".files");
const refreshBtn = document.querySelector("#refresh");
const chatField = document.querySelector("#chat-input");
const chatButton = document.querySelector("#chat-button");
const chatContainer = document.querySelector(".chat-container");
const chatHistory = document.getElementById("chatHistory");
const toggleChat = document.getElementById("toggleChat");
const chatHistoryList = document.querySelector(".chat-history-list");
const newChat = document.getElementById("new-chat");

// Configuration
const authToken = "eWzuMruMIrCVdmcYNAG1IqWMNRVUpdTgsv7jpBEB0b04f1c1";
const folderId = "4y1aKrvjzeQG";
const botId = "oBDbD8R5qbl2";
const HEADERS = { Authorization: `Bearer ${authToken}` };
let chats = [];
let chosenChat = null;

// File Management Functions
const uploadFile = async () => {
  try {
    const file = docField.files[0];
    if (!file) throw new Error("No file selected.");

    // Get signed URL
    const response = await fetch(
      "https://getcody.ai/api/v1/uploads/signed-url",
      {
        method: "POST",
        headers: { ...HEADERS, "Content-Type": "application/json" },
        body: JSON.stringify({
          content_type: file.type,
          file_name: file.name,
        }),
      }
    );
    if (!response.ok) throw new Error("Failed to get signed URL");
    const { key, url } = (await response.json()).data;

    // Upload file
    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    // Finalize upload
    const finalizeResponse = await fetch(
      "https://getcody.ai/api/v1/documents/file",
      {
        method: "POST",
        headers: { ...HEADERS, "Content-Type": "application/json" },
        body: JSON.stringify({ folder_id: folderId, key }),
      }
    );
    if (!finalizeResponse.ok) throw new Error("Failed to finalize upload");
    alert("File uploaded successfully!");
  } catch (error) {
    console.error("Upload Error:", error.message);
  }
};

const getFiles = async () => {
  try {
    const response = await fetch(
      `https://getcody.ai/api/v1/documents?folder_id=${folderId}`,
      { headers: HEADERS }
    );
    if (!response.ok) throw new Error("Failed to fetch files");
    return (await response.json()).data;
  } catch (error) {
    console.error("Fetch Error:", error.message);
    return [];
  }
};

const removeFile = async (fileId) => {
  try {
    const response = await fetch(
      `https://getcody.ai/api/v1/documents/${fileId}`,
      {
        method: "DELETE",
        headers: HEADERS,
      }
    );
    if (!response.ok) throw new Error("Failed to delete file");
    const files = await getFiles();
    renderFiles(files);
    alert("File deleted successfully!");
  } catch (error) {
    console.error("Delete Error:", error.message);
  }
};

const renderFiles = (files) => {
  filesField.innerHTML = "";
  files.forEach((file) => {
    const div = document.createElement("div");

    // File Name
    const fileName = document.createElement("p");
    fileName.textContent = file.name;

    // Delete Button
    const deleteButton = document.createElement("div");
    deleteButton.innerHTML = "&#x2715;"; // Cross icon
    deleteButton.addEventListener("click", () => removeFile(file.id));

    div.appendChild(fileName);
    div.appendChild(deleteButton);
    filesField.appendChild(div);
  });
};

// Chat Management Functions
const createConversation = async (name) => {
  try {
    const response = await fetch("https://getcody.ai/api/v1/conversations", {
      method: "POST",
      headers: { ...HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({ name, bot_id: botId }),
    });
    if (!response.ok) throw new Error("Failed to create conversation");
    chosenChat = (await response.json()).data;
  } catch (error) {
    console.error("Conversation Error:", error.message);
  }
};

const getConversations = async () => {
  try {
    const response = await fetch("https://getcody.ai/api/v1/conversations", {
      headers: HEADERS,
    });
    if (!response.ok) throw new Error("Failed to fetch conversations");
    return (await response.json()).data;
  } catch (error) {
    console.error("Fetch Error:", error.message);
    return [];
  }
};

const deleteConversation = async (conversationId) => {
  try {
    const response = await fetch(
      `https://getcody.ai/api/v1/conversations/${conversationId}`,
      {
        method: "DELETE",
        headers: HEADERS,
      }
    );
    if (!response.ok) throw new Error("Failed to delete conversation");
    alert("Chat deleted successfully!");
    const conversations = await getConversations();
    displayConversations(conversations);
  } catch (error) {
    console.error("Delete Error:", error.message);
  }
};

const displayConversations = (history) => {
  chatHistoryList.innerHTML = "";
  history.forEach((conversation) => {
    const li = document.createElement("div");
    li.classList.add("chat-item");

    // Chat Name
    const chatName = document.createElement("span");
    chatName.textContent =
      conversation.name.length > 20
        ? conversation.name.slice(0, 20) + "..."
        : conversation.name;
    li.addEventListener("click", async () => {
      chosenChat = conversation;
      chats = (await getMessages(conversation.id)).reverse();
      displayMessages();
      chatHistory.classList.remove("open");
    });

    // Delete Button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent triggering the chat selection event
      if (confirm("Are you sure you want to delete this chat?")) {
        deleteConversation(conversation.id);
      }
    });

    li.appendChild(chatName);
    li.appendChild(deleteBtn);
    chatHistoryList.appendChild(li);
  });
};

const getMessages = async (conversationId) => {
  try {
    const response = await fetch(
      `https://getcody.ai/api/v1/messages?conversation_id=${conversationId}`,
      { headers: HEADERS }
    );
    if (!response.ok) throw new Error("Failed to fetch messages");
    return (await response.json()).data;
  } catch (error) {
    console.error("Fetch Error:", error.message);
    return [];
  }
};

const displayMessages = () => {
  chatContainer.innerHTML = "";
  chats.forEach((chat) => {
    const message = document.createElement("p");
    message.innerHTML = marked.parse(chat.content);
    message.classList.add(chat.machine ? "chat-bot" : "chat-person");
    chatContainer.appendChild(message);
  });
};

const startNewChat = () => {
  chatHistory.classList.remove("open");
  chosenChat = null;
  chats = [];
  displayMessages();
};

const answerQuestion = async (question) => {
  try {
    const response = await fetch("https://getcody.ai/api/v1/messages", {
      method: "POST",
      headers: { ...HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({
        content: question,
        conversation_id: chosenChat.id,
      }),
    });
    if (!response.ok) throw new Error("Failed to answer question");
    const { content } = (await response.json()).data;
    chats.push({ content, machine: true });
    displayMessages();
  } catch (error) {
    console.error("Chat Error:", error.message);
  }
};

const sendChat = async () => {
  if (!chatField.value.trim()) return;
  const message = { content: chatField.value, machine: false };
  chats.push(message);
  displayMessages();

  chatField.value = "";
  if (!chosenChat) {
    await createConversation(message.content);
    const conversations = await getConversations();
    displayConversations(conversations);
  }
  answerQuestion(message.content);
};

// Event Listeners
button.addEventListener("click", async () => {
  if (docField.files.length > 0) {
    await uploadFile();
    const files = await getFiles();
    renderFiles(files);
  } else {
    alert("Please select a file to upload.");
  }
});

refreshBtn.addEventListener("click", async () => {
  const files = await getFiles();
  renderFiles(files);
});

toggleChat.addEventListener("click", () => {
  chatHistory.classList.toggle("open"); // Toggle the `open` class
});

chatButton.addEventListener("click", sendChat);

newChat.addEventListener("click", startNewChat);

document.addEventListener("DOMContentLoaded", async () => {
  const files = await getFiles();
  renderFiles(files);
  const conversations = await getConversations();
  displayConversations(conversations);
});
