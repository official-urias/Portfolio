// Node.js Backend Server for AI/ML Portfolio
// Zero external dependency setup using built-in node modules (http, fs, path, url)
// Features: Static asset serving + Live AI Model Telemetry & Inference Simulation API + Contact Gateway

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3042;
const MAX_BODY_SIZE = 100 * 1024; // 100 KB limit for POST requests

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

// Helper: parse JSON request body with size constraint
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    let size = 0;

    req.on('data', chunk => {
      size += chunk.length;
      if (size > MAX_BODY_SIZE) {
        reject(new Error('Payload Too Large'));
        req.destroy();
        return;
      }
      body += chunk;
    });

    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}');
        resolve(parsed);
      } catch (err) {
        reject(new Error('Invalid JSON payload'));
      }
    });

    req.on('error', err => {
      reject(err);
    });
  });
}

// Simulated AI Inference Engine for Node.js API demonstration
function simulateModelInference(prompt, task = 'inference') {
  const tokens = prompt.trim().split(/\s+/);
  const latencyMs = Math.floor(Math.random() * 20) + 14; // 14-34ms simulated TensorRT latency
  const lower = prompt.toLowerCase();

  const isEncrypted = lower.includes('paillier') || lower.includes('encrypted') || lower.includes('gradient');
  const isBenign = lower.includes('typical') || lower.includes('standard') || lower.includes('baseline');

  if (isEncrypted) {
    return {
      task: 'federated_encryption_verification',
      tokens_analyzed: tokens.length,
      latency_ms: latencyMs,
      precision: 'FP16',
      confidence_str: '100.0% (Zero-Knowledge Verified)',
      compute_device: 'Node.js Cryptographic Gateway (2,048-bit Paillier)',
      execution_html: `
        <strong>[Federated Aggregation Validated]</strong><br>
        Homomorphic Batch: 2,048-bit Paillier Cryptosystem<br>
        Weight Verification: OK &bull; Zero Gradient Leakage<br>
        Convergence Round: Synchronized across distributed nodes.
      `,
      telemetry: {
        roc_auc: 0.991,
        loss: 0.018,
        gradient_leakage: '0.000%'
      }
    };
  }

  if (isBenign) {
    return {
      task: 'asd_phenotypic_classification',
      tokens_analyzed: tokens.length,
      latency_ms: latencyMs,
      precision: 'FP16',
      confidence_str: '96.8% (Neurotypical Baseline)',
      compute_device: 'Ansah-Ensemble-v2 (CNN-LSTM Hybrid)',
      execution_html: `
        <strong>[Ensemble Prediction: Low Risk]</strong><br>
        CNN Spatial Feature Extractor: Concordance 0.94<br>
        LSTM Recurrent Sequential Score: Baseline Normal<br>
        Classification: No atypical variance detected.
      `,
      telemetry: {
        roc_auc: 0.984,
        loss: 0.038,
        latent_weights: [0.124, 0.189, 0.095]
      }
    };
  }

  // Default: ASD Positive / Clinical High Risk Indicator
  return {
    task: 'asd_phenotypic_classification',
    tokens_analyzed: tokens.length,
    latency_ms: latencyMs,
    precision: 'FP16',
    confidence_str: '98.4% (ASD Positive Indicator)',
    compute_device: 'Ansah-Ensemble-v2 (CNN-LSTM Hybrid / TensorRT)',
    execution_html: `
      <strong>[Inference Execution Completed]</strong><br>
      Ensemble Latent Weights: [0.941, 0.887, 0.992]<br>
      ROC-AUC Diagnostic Precision: 0.984 &bull; Loss: 0.041 &darr;<br>
      Spatial-Temporal Fusion: Attenuated gesture & eye-gaze indicators identified.
    `,
    telemetry: {
      roc_auc: 0.984,
      loss: 0.041,
      latent_weights: [0.941, 0.887, 0.992]
    }
  };
}

const server = http.createServer(async (req, res) => {
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
    try {
      const payload = await parseJsonBody(req);
      const prompt = payload.prompt || 'Optimizing deep learning pipelines with low latency.';
      const task = payload.task || 'inference';
      const result = simulateModelInference(prompt, task);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (err) {
      const status = err.message === 'Payload Too Large' ? 413 : 400;
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // API Route: Contact Transmission Handler
  if (pathname === '/api/contact' && req.method === 'POST') {
    try {
      const payload = await parseJsonBody(req);
      const { name, email, message } = payload;

      if (!name || !email || !message) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'All fields (name, email, message) are required.' }));
        return;
      }

      console.log(`[Contact Transmission Received] ${new Date().toISOString()}`);
      console.log(`From: ${name} <${email}>`);
      console.log(`Message: ${message}\n`);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Transmission confirmed. Emmanuel will respond within 24 hours.'
      }));
    } catch (err) {
      const status = err.message === 'Payload Too Large' ? 413 : 400;
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // Static File Serving with Path Traversal Protection
  if (pathname === '/') {
    pathname = '/index.html';
  }

  const cleanPath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.resolve(__dirname, '.' + cleanPath);

  // Prevent directory traversal outside __dirname
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

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
  console.log(`📬 Contact Form API live at: http://localhost:${PORT}/api/contact`);
  console.log(`📡 System Telemetry at: http://localhost:${PORT}/api/status`);
  console.log(`======================================================\n`);
});
