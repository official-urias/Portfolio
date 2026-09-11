// Node.js Backend Server for AI/ML Portfolio
// Zero external dependency setup using built-in node modules (http, fs, path, url)
// Features: Static asset serving + Live AI Model Telemetry & Inference Simulation API

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

// Simulated AI Inference Engine for Node.js API demonstration
function simulateModelInference(prompt, task = 'sentiment') {
  const tokens = prompt.trim().split(/\s+/);
  const latencyMs = Math.floor(Math.random() * 25) + 12; // 12-37ms simulated TensorRT latency
  
  if (task === 'sentiment') {
    const positiveWords = ['great', 'good', 'love', 'fast', 'sota', 'optimal', 'accuracy', 'super', 'best', 'effective'];
    const negativeWords = ['slow', 'bad', 'lag', 'error', 'loss', 'fail', 'poor', 'expensive', 'heavy', 'degrade'];
    
    let posScore = 0.5;
    let lower = prompt.toLowerCase();
    positiveWords.forEach(w => { if (lower.includes(w)) posScore += 0.15; });
    negativeWords.forEach(w => { if (lower.includes(w)) posScore -= 0.15; });
    posScore = Math.max(0.02, Math.min(0.98, posScore));
    
    return {
      task: 'sentiment_analysis',
      tokens_analyzed: tokens.length,
      latency_ms: latencyMs,
      compute_device: 'CUDA:0 (Simulated TensorRT/Triton)',
      predictions: [
        { label: 'Positive', confidence: parseFloat(posScore.toFixed(4)) },
        { label: 'Neutral / Ambiguous', confidence: parseFloat((Math.abs(0.5 - posScore) * 0.3).toFixed(4)) },
        { label: 'Negative', confidence: parseFloat((1 - posScore).toFixed(4)) }
      ],
      top_tokens: tokens.slice(0, 8).map(t => ({
        token: t,
        attention_weight: parseFloat((Math.random() * 0.8 + 0.2).toFixed(3))
      }))
    };
  }

  return {
    task: 'general_embedding',
    tokens_analyzed: tokens.length,
    latency_ms: latencyMs,
    dimension: 1536,
    sample_vector: Array.from({ length: 5 }, () => parseFloat((Math.random() * 2 - 1).toFixed(4))),
    compute_device: 'Node.js TensorRT Stream Gateway'
  };
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Route: AI Status / Telemetry
  if (pathname === '/api/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ONLINE',
      system: 'Emmanuel Gyan Ansah Research Core v4.2',
      backend: 'Node.js v' + process.version,
      accelerator: 'AWS Cloud & Accelerated Neural Inference',
      uptime: process.uptime().toFixed(1) + 's',
      memory_usage_mb: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
      active_models: [
        'Affum-Ansah-CNN-LSTM-Autism',
        'Federated-HE-Fraud-Classifier',
        'CloudScale-Serverless-Engine'
      ],
      publications: [
        'SN Computer Science (SNCS) Under Review: Autism Ensemble',
        'ResearchGate Preprint: Federated Homomorphic Encryption Fraud Detection'
      ]
    }));
    return;
  }

  // API Route: Simulated Model Inference
  if (pathname === '/api/inference' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const prompt = payload.prompt || 'Optimizing deep learning pipelines with low latency.';
        const task = payload.task || 'sentiment';
        const result = simulateModelInference(prompt, task);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload', details: err.message }));
      }
    });
    return;
  }

  // Static File Serving
  if (pathname === '/') {
    pathname = '/index.html';
  }

  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(__dirname, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 AI/ML Portfolio Server running on: http://localhost:${PORT}`);
  console.log(`🤖 Node.js Inference API live at: http://localhost:${PORT}/api/inference`);
  console.log(`📡 System Telemetry at: http://localhost:${PORT}/api/status`);
  console.log(`======================================================\n`);
});
