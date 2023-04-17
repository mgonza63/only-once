const messageForm = document.querySelector("form");
const messageInput = document.querySelector("#messageInput");
const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000/"
    : "prodlink";

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = messageInput.value;
  const message = { text };
  console.log(message);

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(message),
    headers: {
      "content-type": "application/json",
    },
  });
});
