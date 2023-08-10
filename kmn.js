const AsciiTable = require("ascii-table");
const { sha3_256 } = require("js-sha3");
const SecureRandom = require("secure-random");
const readline = require("readline-sync");

const args = process.argv.slice(2);

const key = sha3_256(SecureRandom(SecureRandom(1)[0]));
const pcChoice = Math.floor(Math.random() * (args.length - 1));
const HMAC = sha3_256(args[pcChoice] + key);

function validate(args) {
  const length = args.length;
  if (length <= 1 || length % 2 != 1) {
    console.log("An odd number of lines or / or less than 3 entered! Example: node kmn rock paper scissors lizard spock");
  } else if (args.some((arg, i, arr) => (arr.indexOf(arg, i + 1) === -1 ? false : true))) {
    console.log("Strings cannot be repeated! Example: node kmn rock paper scissors lizard spock");
  } else {
    console.log("HMAC: ", HMAC);
    rules(args);
  }
}

console.log("");
console.log("");

function rules(args) {
  console.log("Aviable moves:");
  args.forEach((arg, i) => {
    console.log(i + 1 + " - " + arg);
  });
  console.log(0 + " - " + "exit");
  console.log("?" + " - " + "help");

  const userChoice = readline.question("Enter your move: ");
  if (userChoice === "?") {
    generateTable(args);
  } else if (userChoice === "0") {
    return;
  } else if (args[userChoice - 1] === undefined) {
    rules(args);
  } else if (userChoice !== "0") {
    checkWin(userChoice - 1, pcChoice, args.length);
  }
}

function generateTable(args) {
  const table = new AsciiTable();
  table.setHeading("v PC \\ USER >", ...args);
  let templateOfRules = [
    "DRAW",
    ...Array.from({ length: Math.floor(args.length / 2) }, (e) => "WIN"),
    ...Array.from({ length: Math.floor(args.length / 2) }, (e) => "LOSE"),
  ];
  args.forEach((arg) => {
    table.addRow(arg, ...templateOfRules);
    const lastEl = templateOfRules.pop();
    templateOfRules = [lastEl, ...templateOfRules];
  });
  console.log(table.toString());
  rules(args);
}

function checkWin(userChoice, pcChoice, argsLength) {
  console.log("Your move: " + args[userChoice]);
  console.log("Computer move: " + args[pcChoice]);

  if (userChoice === pcChoice) {
    console.log("You draw!");
  } else if (pcChoice > userChoice && pcChoice - userChoice > argsLength / 2) {
    console.log("You win!");
  } else if (userChoice > pcChoice && userChoice - pcChoice < argsLength / 2) {
    console.log("You win!");
  } else {
    console.log("You lose!");
  }
  console.log("HMAC key: " + key);
}

validate(args);
