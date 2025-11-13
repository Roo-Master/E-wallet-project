// server.js
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

let users = {
  'user1': {
    walletBalance: 100.00,
    transactions: []
  }
};

// Middleware to simulate user authentication
app.use((req, res, next) => {
  req.userId = 'user1'; // hardcoded for demo
  next();
});

// Get wallet balance
app.get('/wallet', (req, res) => {
  const user = users[req.userId];
  res.json({ balance: user.walletBalance, transactions: user.transactions });
});

// Add money to wallet
app.post('/wallet/add', (req, res) => {
  const { amount } = req.body;
  if (amount <= 0) return res.status(400).json({ error: 'Invalid amount' });
  const user = users[req.userId];
  user.walletBalance += amount;
  user.transactions.push({ type: 'credit', amount, date: new Date(), description: 'Wallet top-up' });
  res.json({ balance: user.walletBalance });
});

// Pay using wallet
app.post('/pay/wallet', (req, res) => {
  const { amount, description } = req.body;
  const user = users[req.userId];
  if (amount <= 0) return res.status(400).json({ error: 'Invalid amount' });
  if (user.walletBalance < amount) return res.status(400).json({ error: 'Insufficient wallet balance' });
  user.walletBalance -= amount;
  user.transactions.push({ type: 'debit', amount, date: new Date(), description: description || 'Payment' });
  res.json({ balance: user.walletBalance, message: 'Payment successful' });
});

// Simulate external payment (e.g., credit card)
app.post('/pay/external', (req, res) => {
  const { amount, description } = req.body;
  if (amount <= 0) return res.status(400).json({ error: 'Invalid amount' });
  // Here you would integrate with real payment gateway APIs (Stripe, PayPal, etc.)
  // For demo, we just simulate success
  const user = users[req.userId];
  user.transactions.push({ type: 'external', amount, date: new Date(), description: description || 'External payment' });
  res.json({ message: 'External payment successful' });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));