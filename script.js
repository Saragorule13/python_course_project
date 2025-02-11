async function sendMessage() {
    const message = document.getElementById("messageInput").value;
    const replyElement = document.getElementById("reply");

    if (message.trim() === "") {
        replyElement.innerText = "Please enter a message.";
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
        });

        const data = await response.json();
        replyElement.innerText = `Reply: ${data.reply}`;
    } catch (error) {
        console.error("Error:", error);
        replyElement.innerText = "Failed to get response.";
    }
}
