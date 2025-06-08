const express = require('express');
const cors = require('cors');
const QRCode = require('qrcode');
const { makeWASocket, DisconnectReason, useMultiFileAuthState } = require('baileys');
const NodeCache = require('node-cache');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const instances = new Map();
const sockets = new Map();
const qrCodeCache = new NodeCache({ stdTTL: 300 });

const logger = {
  info: (msg, data) => console.log(`[INFO] ${msg}`, data || ''),
  error: (msg, error) => console.error(`[ERROR] ${msg}`, error || ''),
  warn: (msg, data) => console.warn(`[WARN] ${msg}`, data || '')
};

async function getAuthState(instanceName) {
  const authPath = path.join(__dirname, 'auth', instanceName);
  await fs.ensureDir(authPath);
  return await useMultiFileAuthState(authPath);
}

async function createWhatsAppSocket(instanceName, qrCallback) {
  try {
    const { state, saveCreds } = await getAuthState(instanceName);
    
    const socket = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      browser: ['AutoCred', 'Chrome', '120.0.6099.216'],
      version: [2, 3000, 1015901307],
      connectTimeoutMs: 60000,
      defaultQueryTimeoutMs: 60000,
      keepAliveIntervalMs: 10000,
      qrTimeout: 45000,
      markOnlineOnConnect: false,
      syncFullHistory: false,
      generateHighQualityLinkPreview: false
    });

    socket.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;
      
      if (qr && qrCallback) {
        logger.info(`🔄 QR Code gerado para ${instanceName}`);
        qrCallback(qr);
      }
      
      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
        logger.info(`🔄 Conexão fechada para ${instanceName}, reconectando: ${shouldReconnect}`);
        
        if (shouldReconnect) {
          setTimeout(() => createWhatsAppSocket(instanceName, qrCallback), 5000);
        }
      } else if (connection === 'open') {
        logger.info(`✅ WhatsApp conectado para ${instanceName}`);
        const instance = instances.get(instanceName);
        if (instance) {
          instance.status = 'connected';
          instance.connectionStatus = 'open';
          instance.lastActivity = new Date().toISOString();
        }
        qrCodeCache.del(instanceName);
      }
    });

    socket.ev.on('creds.update', saveCreds);
    
    return socket;
  } catch (error) {
    logger.error(`❌ Erro ao criar socket para ${instanceName}:`, error);
    throw error;
  }
}

app.get('/instance/qrcode/:instanceName', async (req, res) => {
  try {
    const { instanceName } = req.params;
    
    if (!instances.has(instanceName)) {
      return res.status(404).json({ 
        error: 'Instância não encontrada',
        suggestion: 'Crie a instância primeiro com POST /instance/create'
      });
    }

    const instance = instances.get(instanceName);
    qrCodeCache.del(instanceName);
    
    logger.info(`🔄 Gerando QR Code REAL para ${instanceName}`);
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout ao gerar QR Code'));
      }, 45000);
      
      createWhatsAppSocket(instanceName, async (qr) => {
        try {
          clearTimeout(timeout);
          
          const qrCodeImage = await QRCode.toDataURL(qr, {
            type: 'image/png',
            quality: 1.0,
            margin: 1,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            },
            width: 512,
            errorCorrectionLevel: 'L',
            scale: 8
          });
          
          qrCodeCache.set(instanceName, qrCodeImage);
          
          instance.lastActivity = new Date().toISOString();
          instance.qr_generated = true;
          instance.status = 'qr_ready';
          
          logger.info(`✅ QR Code VÁLIDO gerado para ${instanceName}`);
          
          resolve(res.json({
            success: true,
            qrcode: qrCodeImage,
            instance: instanceName,
            message: '🔥 QR Code REAL do WhatsApp - VÁLIDO!',
            status: 'qr_ready',
            baileys_version: '6.7.18',
            type: 'real_whatsapp_qr'
          }));
        } catch (error) {
          clearTimeout(timeout);
          reject(error);
        }
      }).then(socket => {
        sockets.set(instanceName, socket);
      }).catch(reject);
    });
    
  } catch (error) {
    logger.error('❌ Erro ao gerar QR Code:', error);
    res.status(500).json({ 
      error: 'Erro interno ao gerar QR Code',
      details: error.message
    });
  }
});

app.post('/instance/create', async (req, res) => {
  try {
    const { instanceName } = req.body;
    
    if (!instanceName) {
      return res.status(400).json({ 
        error: 'instanceName é obrigatório'
      });
    }
    
    if (instances.has(instanceName)) {
      const instance = instances.get(instanceName);
      return res.json({
        instance: {
          instanceName,
          status: instance.status,
          connectionStatus: instance.connectionStatus,
          message: 'Instância já existe'
        }
      });
    }
    
    const instance = {
      instanceName,
      status: 'created',
      connectionStatus: 'connecting',
      created_at: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      qr_generated: false
    };
    
    instances.set(instanceName, instance);
    
    logger.info(`✅ Nova instância criada: ${instanceName}`);
    
    res.json({
      instance: {
        instanceName,
        status: 'created',
        connectionStatus: 'connecting',
        message: 'Instância criada! Use /instance/qrcode para conectar WhatsApp.'
      }
    });
    
  } catch (error) {
    logger.error('Erro ao criar instância:', error);
    res.status(500).json({ 
      error: 'Erro interno ao criar instância',
      details: error.message 
    });
  }
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    instances: instances.size,
    uptime: process.uptime(),
    version: '3.0.0-OPTIMIZED',
    baileys_version: '6.7.18'
  });
});

app.get('/manager/fetchInstances', (req, res) => {
  const instanceList = Array.from(instances.entries()).map(([name, instance]) => ({
    instanceName: name,
    status: instance.status || 'created',
    connectionStatus: instance.connectionStatus || 'ready',
    created_at: instance.created_at,
    lastActivity: instance.lastActivity || null
  }));
  
  res.json(instanceList);
});

app.get('/', (req, res) => {
  res.json({
    message: '🚀🔥 AutoCred Evolution API v3.0 - OTIMIZADA!',
    status: 'online',
    version: '3.0.0-OPTIMIZED',
    baileys_version: '6.7.18',
    instances: instances.size,
    connected_sockets: sockets.size,
    uptime: Math.floor(process.uptime())
  });
});

app.listen(PORT, () => {
  logger.info(`🚀 AutoCred Evolution API v3.0 iniciada na porta ${PORT}`);
}); 