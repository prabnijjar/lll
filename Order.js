export class Order {
constructor(sFrom) {
this.sFrom = sFrom;
this.isDone = false;

this.menu = {
butterChicken: {
name: "Butter Chicken",
sizes: { small: 12, medium: 15, large: 18 },
spice: ["mild", "medium", "hot"]
},
biryani: {
name: "Chicken Biryani",
sizes: { small: 11, medium: 14, large: 17 },
toppings: ["raita", "extrachicken", "friedonions"]
}
};

this.drinks = {
mangolassi: { name: "Mango Lassi", price: 4 },
masalachai: { name: "Masala Chai", price: 3 },
coke: { name: "Coke", price: 2 }
};

this.cart = [];
this.stage = "WELCOME";
this.askedUpsell = false;
}

handleInput(sInput) {
const text = (sInput || "").trim();
const lower = text.toLowerCase();

if (lower === "reset") {
this.cart = [];
this.stage = "WELCOME";
this.isDone = false;
this.askedUpsell = false;
return ["Reset complete. Type hi to start again."];
}

if (this.stage === "WELCOME") {
this.stage = "ORDERING";
return [
"Welcome to Indiqan Takeout.",
"Type menu to see options.",
"Quick start: order butter chicken size medium spice hot"
];
}

if (lower === "menu") return [this.formatMenu()];
if (lower === "cart") return [this.formatCart()];

if (lower === "checkout") {
if (this.cart.length === 0) return ["Your cart is empty. Type menu to start."];
this.stage = "CHECKOUT";
return [this.formatCart(), "Reply confirm to place your order."];
}

if (lower === "confirm") {
if (this.stage !== "CHECKOUT") return ["Type checkout first."];
const total = this.cartTotal();
this.isDone = true;
return [
`Order confirmed. Total: $${total.toFixed(2)}.`,
"Thanks for ordering from Indiqan Takeout."
];
}

if (lower.startsWith("drink ")) {
const drinkName = lower.replace("drink ", "").trim();
const msg = this.addDrink(drinkName);
return [msg, this.formatCart()];
}

if (lower.startsWith("order ")) {
const msg = this.addFoodOrder(lower);
if (msg.startsWith("Added")) {
const out = [msg, this.formatCart()];
if (!this.askedUpsell) {
this.askedUpsell = true;
out.splice(1, 0, "Want a drink? Try: drink mango lassi, drink masala chai, drink coke");
}
return out;
}
return [msg];
}

return [
"I did not understand.",
"Try: menu",
"Or: order biryani size large toppings raita"
];
}

formatMenu() {
return `Menu
1) Butter Chicken
Sizes: small, medium, large
Spice: mild, medium, hot
Example: order butter chicken size medium spice hot

2) Chicken Biryani
Sizes: small, medium, large
Toppings: raita, extraChicken, friedOnions
Example: order biryani size large toppings raita

Drinks
drink mango lassi
drink masala chai
drink coke

Other commands
cart
checkout
confirm
reset`;
}

addFoodOrder(lower) {
if (lower.includes("butter chicken")) {
const size = this.pickAfterWord(lower, "size");
const spice = this.pickAfterWord(lower, "spice");
return this.addButterChicken(size, spice);
}

if (lower.includes("biryani")) {
const size = this.pickAfterWord(lower, "size");
const toppings = this.pickListAfterWord(lower, "toppings").map(t => t.toLowerCase());
return this.addBiryani(size, toppings);
}

return "I could not find that item. Type menu to see options.";
}

addButterChicken(size, spice) {
const item = this.menu.butterChicken;
if (!item.sizes[size]) return "Pick a size: small, medium, large.";
if (!item.spice.includes(spice)) return "Pick spice: mild, medium, hot.";

const price = item.sizes[size];
this.cart.push({
type: "butterChicken",
label: `Butter Chicken (${size}) spice ${spice}`,
price
});

return `Added Butter Chicken (${size}) spice ${spice}.`;
}

addBiryani(size, toppings) {
const item = this.menu.biryani;
if (!item.sizes[size]) return "Pick a size: small, medium, large.";
if (!toppings || toppings.length === 0) {
return "Add at least 1 topping: raita, extraChicken, friedOnions.";
}

const normalized = toppings.map(t => t.replace(/\s+/g, "").toLowerCase());
const bad = normalized.filter(t => !item.toppings.includes(t));
if (bad.length > 0) return "Unknown topping. Options: raita, extraChicken, friedOnions.";

const base = item.sizes[size];
const toppingPrices = { raita: 1, extrachicken: 3, friedonions: 1 };
const extra = normalized.reduce((sum, t) => sum + (toppingPrices[t] || 0), 0);
const price = base + extra;
const display = normalized.join(", ");

this.cart.push({
type: "biryani",
label: `Chicken Biryani (${size}) toppings ${display}`,
price
});

return `Added Chicken Biryani (${size}) with ${display}.`;
}

addDrink(drinkName) {
const key = drinkName.toLowerCase().replace(/\s+/g, "");
const drink = this.drinks[key];
if (!drink) return "Drink options: mango lassi, masala chai, coke.";

this.cart.push({
type: "drink",
label: drink.name,
price: drink.price
});

return `Added drink: ${drink.name}.`;
}

pickAfterWord(text, word) {
const parts = text.split(/\s+/);
const idx = parts.indexOf(word);
if (idx === -1) return "";
return parts[idx + 1] || "";
}

pickListAfterWord(text, word) {
const parts = text.split(/\s+/);
const idx = parts.indexOf(word);
if (idx === -1) return [];
return parts.slice(idx + 1).filter(Boolean);
}

cartTotal() {
return this.cart.reduce((sum, item) => sum + item.price, 0);
}

formatCart() {
if (this.cart.length === 0) return "Your cart is empty. Type menu to start.";
const lines = this.cart.map((item, i) => `${i + 1}) ${item.label} $${item.price.toFixed(2)}`);
return `Cart
${lines.join("\n")}
Total: $${this.cartTotal().toFixed(2)}`;
}
}
