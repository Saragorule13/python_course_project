const apiUrl = "http://127.0.0.1:8000"; // Backend URL

async function sendMessage() {
    const messageInput = document.getElementById("messageInput");
    const replyElement = document.getElementById("reply");

    const message = messageInput.value.trim();
    if (message === "") {
        replyElement.innerText = "Please enter a message.";
        return;
    }

    try {
        // Send message to backend
        const response = await fetch(`${apiUrl}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
        });

        const data = await response.json();
        replyElement.innerText = `Reply: ${data.reply}`;

        // Clear input field
        messageInput.value = "";

        // Reload chat history
        loadChatHistory();
    } catch (error) {
        console.error("Error:", error);
        replyElement.innerText = "Failed to get response.";
    }
}

// Function to fetch and display chat history
async function loadChatHistory() {
    try {
        const response = await fetch(`${apiUrl}/history`);
        const chatHistory = await response.json();

        const chatContainer = document.getElementById("chat-history");
        chatContainer.innerHTML = ""; // Clear existing content

        chatHistory.forEach(chat => {
            const userMessage = document.createElement("p");
            userMessage.innerHTML = `<strong>You:</strong> ${chat.question}`;

            const botReply = document.createElement("p");
            botReply.innerHTML = `<strong>Bot:</strong> ${chat.answer}`;

            chatContainer.appendChild(userMessage);
            chatContainer.appendChild(botReply);
        });
    } catch (error) {
        console.error("Error loading chat history:", error);
    }
}

// Load chat history on page load
document.addEventListener("DOMContentLoaded", loadChatHistory);
