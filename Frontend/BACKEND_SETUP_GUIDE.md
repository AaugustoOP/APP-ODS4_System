# 🔧 Guia de Configuração do Backend - EduFocus

## 📋 Resumo

Este guia ajuda você a configurar o backend local para sua aplicação EduFocus. O frontend já está pronto e esperando pelos endpoints da API.

## 🗄️ Schema do Banco de Dados (SQLite)

### Tabela: users

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, -- Hash bcrypt
  avatar TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: tasks

```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  estimated_pomodoros INTEGER DEFAULT 1,
  completed_pomodoros INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT 0,
  priority TEXT CHECK(priority IN ('low', 'medium', 'high')),
  due_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Tabela: study_sessions

```sql
CREATE TABLE study_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  task_id TEXT,
  subject TEXT NOT NULL,
  duration INTEGER NOT NULL, -- minutos
  type TEXT CHECK(type IN ('focus', 'break')),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL
);
```

### Tabela: user_stats

```sql
CREATE TABLE user_stats (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  last_study_date DATE,
  total_minutes INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Tabela: achievements

```sql
CREATE TABLE achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT,
  target INTEGER NOT NULL
);
```

### Tabela: user_achievements

```sql
CREATE TABLE user_achievements (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  achievement_id TEXT NOT NULL,
  unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
  UNIQUE(user_id, achievement_id)
);
```

### Tabela: user_settings

```sql
CREATE TABLE user_settings (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  focus_duration INTEGER DEFAULT 25,
  short_break_duration INTEGER DEFAULT 5,
  long_break_duration INTEGER DEFAULT 15,
  pomodoros_until_long_break INTEGER DEFAULT 4,
  daily_goal INTEGER DEFAULT 120, -- minutos
  notifications_email BOOLEAN DEFAULT 1,
  notifications_push BOOLEAN DEFAULT 1,
  notifications_session_reminders BOOLEAN DEFAULT 1,
  notifications_achievement_alerts BOOLEAN DEFAULT 1,
  theme TEXT CHECK(theme IN ('light', 'dark', 'auto')) DEFAULT 'auto',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Tabela: daily_intentions

```sql
CREATE TABLE daily_intentions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  intention TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, date)
);
```

## 🚀 Stack Recomendada para Backend

### Opção 1: Node.js + Express + SQLite (Mais Simples)

```bash
npm init -y
npm install express sqlite3 bcrypt jsonwebtoken cors dotenv
npm install -D nodemon typescript @types/express @types/node
```

### Opção 2: Node.js + Fastify + Better-SQLite3 (Mais Rápido)

```bash
npm init -y
npm install fastify @fastify/cors better-sqlite3 bcrypt jsonwebtoken dotenv
npm install -D nodemon typescript @types/node
```

### Opção 3: Bun + Hono + SQLite (Moderno)

```bash
bun init
bun add hono better-sqlite3 bcrypt jsonwebtoken
```

## 📁 Estrutura de Pastas Recomendada

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── auth.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Task.js
│   │   ├── StudySession.js
│   │   └── ...
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── tasks.js
│   │   ├── sessions.js
│   │   ├── stats.js
│   │   ├── settings.js
│   │   ├── intentions.js
│   │   └── reports.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   └── ...
│   ├── services/
│   │   ├── authService.js
│   │   ├── statsService.js
│   │   └── ...
│   └── server.js
├── database/
│   └── edufocus.db
├── .env
├── package.json
└── README.md
```

## 🔐 Exemplo de Implementação - Auth Middleware

```javascript
// src/middlewares/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Token não fornecido',
        code: 'NO_TOKEN'
      }
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Token inválido',
        code: 'INVALID_TOKEN'
      }
    });
  }
};

module.exports = authMiddleware;
```

## 📝 Exemplo de Implementação - Auth Routes

```javascript
// src/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar se email já existe
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Email já cadastrado',
          code: 'EMAIL_EXISTS'
        }
      });
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 10);

    // Criar usuário
    const userId = Date.now().toString();
    db.prepare(`
      INSERT INTO users (id, name, email, password)
      VALUES (?, ?, ?, ?)
    `).run(userId, name, email, passwordHash);

    // Criar stats iniciais
    db.prepare(`
      INSERT INTO user_stats (id, user_id)
      VALUES (?, ?)
    `).run(Date.now().toString() + '1', userId);

    // Criar settings iniciais
    db.prepare(`
      INSERT INTO user_settings (id, user_id)
      VALUES (?, ?)
    `).run(Date.now().toString() + '2', userId);

    // Gerar token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    // Buscar usuário sem senha
    const user = db.prepare(`
      SELECT id, name, email, avatar, created_at, updated_at
      FROM users WHERE id = ?
    `).get(userId);

    res.status(201).json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Erro ao registrar usuário',
        code: 'REGISTER_ERROR'
      }
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuário
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Email ou senha incorretos',
          code: 'INVALID_CREDENTIALS'
        }
      });
    }

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Email ou senha incorretos',
          code: 'INVALID_CREDENTIALS'
        }
      });
    }

    // Gerar token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    // Remover senha do retorno
    delete user.password;

    res.json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Erro ao fazer login',
        code: 'LOGIN_ERROR'
      }
    });
  }
});

module.exports = router;
```

## 📝 Exemplo - User Routes

```javascript
// src/routes/users.js
const express = require('express');
const authMiddleware = require('../middlewares/auth');
const db = require('../config/database');

const router = express.Router();

// GET /api/users/me
router.get('/me', authMiddleware, (req, res) => {
  try {
    const user = db.prepare(`
      SELECT id, name, email, avatar, created_at, updated_at
      FROM users WHERE id = ?
    `).get(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Usuário não encontrado',
          code: 'USER_NOT_FOUND'
        }
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Erro ao buscar usuário',
        code: 'GET_USER_ERROR'
      }
    });
  }
});

module.exports = router;
```

## 🔧 Arquivo .env

```env
# Porta do servidor
PORT=3000

# JWT
JWT_SECRET=sua-chave-secreta-super-segura-aqui-123456

# Database
DATABASE_PATH=./database/edufocus.db

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

## 🚀 Iniciar o Servidor

```javascript
// src/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
// ... outros imports

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*'
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
// ... outras rotas

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    error: {
      message: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    }
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 API disponível em http://localhost:${PORT}/api`);
});
```

## 📦 Scripts do package.json

```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "init-db": "node scripts/initDatabase.js"
  }
}
```

## ✅ Checklist de Implementação

- [ ] Criar estrutura de pastas
- [ ] Instalar dependências
- [ ] Configurar arquivo .env
- [ ] Criar schema do banco de dados SQLite
- [ ] Implementar middleware de autenticação
- [ ] Implementar rotas de autenticação (register, login)
- [ ] Implementar rotas de usuários (GET /me, PUT /me)
- [ ] Implementar rotas de tarefas (CRUD completo)
- [ ] Implementar rotas de sessões de estudo
- [ ] Implementar rotas de estatísticas
- [ ] Implementar rotas de configurações
- [ ] Implementar rotas de intenções diárias
- [ ] Implementar rotas de relatórios
- [ ] Testar todos os endpoints com Postman/Insomnia
- [ ] Configurar CORS corretamente
- [ ] Adicionar validação de dados
- [ ] Adicionar tratamento de erros

## 🧪 Testando com Thunder Client / Postman

### 1. Registrar usuário

```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

### 2. Fazer login

```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "senha123"
}
```

### 3. Obter dados do usuário (com token)

```
GET http://localhost:3000/api/users/me
Authorization: Bearer SEU_TOKEN_AQUI
```

## 📚 Recursos Adicionais

- [Express.js Documentation](https://expressjs.com/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Better-SQLite3](https://github.com/WiseLibs/better-sqlite3)
- [JWT.io](https://jwt.io/)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)

---

**Boa sorte com o desenvolvimento do backend! 🚀**
