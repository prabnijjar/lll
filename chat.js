import { Order } from "./Order.js";

class Chat extends HTMLElement {
constructor() {
super();
this.oOrder = new Order("999-999-9999");
}

sendMessage(evt) {
evt.preventDefault();
const msg = this.input.value;
if (!msg.trim()) return;
this.input.value = "";
this.writeLine(msg);
}

writeLine(text) {
this.messages.insertAdjacentHTML(
"beforeend",
`<li class="user">You: ${text}</li>`
);

const replies = this.oOrder.handleInput(text);

if (this.oOrder.isDone) {
this.oOrder = new Order("999-999-9999");
}

for (const r of replies) {
this.messages.insertAdjacentHTML(
"beforeend",
`<li class="bot">Bot: ${r}</li>`
);
}

this.messages.scrollTop = this.messages.scrollHeight;
}

connectedCallback() {
this.innerHTML = `
<style>
.chatbox {
width: 100%;
max-width: 650px;
margin: 20px auto;
border: 1px solid #ddd;
border-radius: 16px;
padding: 16px;
background: white;
font-family: Arial, sans-serif;
}
.chatbox ul {
list-style: none;
padding: 0;
margin: 0;
height: 350px;
overflow-y: auto;
}
.chatbox li {
margin: 10px 0;
padding: 10px 12px;
border-radius: 12px;
}
.chatbox .bot {
background: #f2f2f2;
margin-right: 2em;
}
.chatbox .user {
background: #5ccad7;
color: white;
margin-left: 2em;
}
.chatbox form {
display: flex;
gap: 10px;
margin-top: 12px;
}
.chatbox input {
flex: 1;
padding: 10px;
border: 1px solid #aaa;
border-radius: 999px;
}
.chatbox button {
padding: 10px 14px;
border: none;
border-radius: 10px;
cursor: pointer;
}
</style>

<div class="chatbox">
<ul></ul>
<form>
<input type="text" placeholder="Type: hi, menu, order..., cart, checkout, confirm" />
<button type="submit">Send</button>
</form>
</div>
`;

this.input = this.querySelector("input");
this.messages = this.querySelector("ul");
this.querySelector("form").addEventListener("submit", this.sendMessage.bind(this));
}
}

customElements.define("x-chat", Chat);
