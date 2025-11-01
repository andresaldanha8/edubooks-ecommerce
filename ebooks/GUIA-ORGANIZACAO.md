# 📁 GUIA DE ORGANIZAÇÃO DOS PDFs
## 🎯 **ONDE COLOCAR OS ARQUIVOS:**

# 📁 GUIA DE ORGANIZAÇÃO DOS PDFs

## 🎯 **ONDE COLOCAR OS ARQUIVOS:**

Coloque todos os seus PDFs na pasta:

```markdown
📁 ebooks/
```

## 📋 **NOMES CORRETOS DOS ARQUIVOS:**

Renomeie seus PDFs para estes nomes EXATOS (respeitando maiúsculas/minúsculas e hífens):

### **Produto 1:**

- **Nome no site:** "Complete os Nomes dos Animais"
- **Nome do arquivo:** `complete-os-nomes-dos-animais.pdf`

### **Produto 2:**

- **Nome no site:** "Alfabeto Bíblico Infantil"  
- **Nome do arquivo:** `alfabeto-biblico-infantil.pdf`

### **Produto 3:**

- **Nome no site:** "O Amor de DEUS - START"
- **Nome do arquivo:** `o-amor-de-deus-start.pdf`

### **Produto 4:**

- **Nome no site:** "ATIVIDADES COM SÍLABAS"
- **Nome do arquivo:** `atividades-com-silabas.pdf`

### **Produto 5:**

- **Nome no site:** "LIVRO DE ATIVIDADES CRISTÃS"
- **Nome do arquivo:** `livro-de-atividades-cristas.pdf`

### **Produto 6:**

- **Nome no site:** "Números até 100"
- **Nome do arquivo:** `numeros-ate-100.pdf`

### **Produto 7:**

- **Nome no site:** "SOMAR"
- **Nome do arquivo:** `somar.pdf`

### **Produto 8:**

- **Nome no site:** "Produção de Textos"
- **Nome do arquivo:** `producao-de-textos.pdf`

---

## 🚀 **ESTRUTURA FINAL:**

Após colocar os arquivos, a pasta ficará assim:

```markdown
📁 ebooks/
├── complete-os-nomes-dos-animais.pdf          (9.99)
├── alfabeto-biblico-infantil.pdf              (12.99)
├── o-amor-de-deus-start.pdf                   (14.99) 
├── atividades-com-silabas.pdf                 (11.99)
├── livro-de-atividades-cristas.pdf            (16.99)
├── numeros-ate-100.pdf                         (13.99)
├── somar.pdf                                   (10.99)
├── producao-de-textos.pdf                      (15.99)
└── README.md                                   (este arquivo)
```

## ⚠️ **IMPORTANTE:**

1. **Nomes exatos:** Use exatamente os nomes listados acima
2. **Sem espaços:** Substitua espaços por hífen (-)
3. **Minúsculas:** Tudo em letras minúsculas
4. **Sem acentos:** Remove todos os acentos
5. **Extensão .pdf:** Todos devem terminar com .pdf

## ✅ **COMO TESTAR:**

Após colocar os arquivos:

1. Abra qualquer `produto-X.html`
2. Clique em "COMPRAR AGORA"
3. Complete o checkout
4. Teste os botões de download
5. Verifique se os nomes aparecem corretamente

## 🔧 **PARA ATIVAR DOWNLOADS REAIS:**

Atualmente o sistema simula os downloads. Para ativar downloads reais, no arquivo `checkout.js`, linha ~440, substitua:

```javascript
// ❌ Atual (simulação):
link.href = '#';

// ✅ Para produção (download real):
link.href = filepath;
```

---

## 📞 **DÚVIDAS?**

Se algum nome não corresponder ao seu PDF, me avise que ajusto o sistema!