<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Blockchain Puzzle Game</title>
  <script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script>
  <script src="app.js" defer></script>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; background: #f4f4f4; border-radius: 10px; }
    h1 { color: #333; }
    input, button { width: 100%; padding: 10px; margin-top: 10px; font-size: 16px; }
    button { background-color: #4CAF50; color: white; border: none; cursor: pointer; }
    button:hover { background-color: #45a049; }
    .status { margin-top: 20px; font-weight: bold; }
  </style>
</head>
<body>
  <h1>🧩 Solve the Puzzle</h1>
  <p><strong>Riddle:</strong> The more you take, the more you leave behind. What am I?</p>
  <input type="text" id="guess" placeholder="Your answer..." />
  <button onclick="submitGuess()">Submit Answer</button>
  <button onclick="checkStatus()">Check Puzzle Status</button>
  <div class="status" id="status"></div>
</body>
</html>




const contractAddress = '0x424cf4a6aa9a88a5496e0c7c1779fa6f274eb8785cf089c80fe341b7f6b9331a';
const abi = [
  { "inputs": [], "stateMutability": "payable", "type": "constructor" },
  { "inputs": [], "name": "correctAnswer", "outputs": [{ "internalType": "bytes9", "name": "", "type": "bytes9" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "getBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "solved", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "winner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "string", "name": "_guess", "type": "string" }], "name": "solve", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
];

const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(abi, contractAddress);

async function submitGuess() {
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  const guess = document.getElementById("guess").value;
  try {
    await contract.methods.solve(guess).send({ from: accounts[0] });
    document.getElementById("status").innerText = '✅ Correct! You won the prize.';
  } catch (err) {
    document.getElementById("status").innerText = '❌ Incorrect guess or error: ' + err.message;
  }
}

async function checkStatus() {
  try {
    const isSolved = await contract.methods.solved().call();
    const winner = await contract.methods.winner().call();
    const balance = await contract.methods.getBalance().call();
    let statusText = `🎯 Solved: ${isSolved}\n🏆 Winner: ${winner}\n💰 Contract Balance: ${web3.utils.fromWei(balance, 'ether')} ETH`;
    document.getElementById("status").innerText = statusText;
  } catch (err) {
    document.getElementById("status").innerText = '❌ Failed to retrieve status: ' + err.message;
  }
}
