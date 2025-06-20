# Initial-D-HUD

> **Atenção:** Este projeto ainda está em desenvolvimento e pode conter bugs ou funcionalidades incompletas.

## Sobre

**Initial-D-HUD** é uma HUD (Heads-Up Display) para veículos inspirada no famoso anime/jogo Initial D, desenvolvida para servidores FiveM (GTA V). Ela exibe informações do veículo de forma estilizada, incluindo velocímetro, conta-giros, marcha, boost/turbo e modo noturno, proporcionando uma experiência visual única para os jogadores.

## Funcionalidades

- Velocímetro digital com dígitos estilizados
- Conta-giros (RPM) animado
- Indicação de marcha atual
- Medidor de turbo/boost (se instalado no veículo)
- Modo noturno automático ao ligar os faróis
- Interface visual baseada no painel do Initial D

## Estrutura do Projeto

```
Initial-D-HUD/
│
├── fxmanifest.lua          # Manifesto do recurso para o FiveM
├── client/
│   └── client.lua          # Script principal do lado do cliente (Lua)
└── web/
    ├── index.html          # Interface da HUD (HTML)
    ├── css/
    │   └── styles.css      # Estilos da HUD
    ├── js/
    │   └── script.js       # Lógica da HUD (JavaScript)
    └── img/                # Imagens e sprites da HUD
```

## Como instalar

1. **Copie a pasta `Initial-D-HUD` para a sua pasta de recursos do servidor FiveM.**
2. Adicione `ensure Initial-D-HUD` ao seu `server.cfg`.
3. Reinicie o servidor ou inicie o recurso manualmente.

## Instalação (Standalone)

Siga os passos abaixo para instalar a Initial-D-HUD em qualquer servidor FiveM, independente da base utilizada:

1. **Baixe ou clone este repositório.**
   - Certifique-se de que a pasta se chame `Initial-D-HUD`.

2. **Coloque a pasta na sua pasta de recursos do servidor.**
   - Exemplo: `resources/Initial-D-HUD`

3. **Adicione a linha abaixo no seu `server.cfg` para garantir que o recurso seja iniciado:**
   ```
   ensure Initial-D-HUD
   ```

4. **Reinicie o servidor ou inicie o recurso manualmente pelo console:**
   ```
   start Initial-D-HUD
   ```

5. **Pronto!**
   - A HUD será exibida automaticamente para qualquer jogador que entrar em um veículo.

### Observações

- Este recurso é totalmente standalone e não depende de nenhuma framework específica (ESX, QBCore, etc).
- Para personalizar imagens, cores ou layout, edite os arquivos em `web/`.
- Caso utilize uma base com proteção de NUI, certifique-se de liberar o acesso à interface deste recurso.

## Como funciona

- O script Lua (`client.lua`) coleta informações do veículo do jogador (velocidade, RPM, marcha, turbo, faróis) e envia para a interface via NUI.
- A interface web (`index.html`, `script.js`, `styles.css`) exibe as informações em tempo real, atualizando os ponteiros, dígitos e imagens conforme o estado do veículo.
- O modo noturno é ativado automaticamente ao ligar os faróis do veículo.

## Personalização

- As imagens da HUD podem ser substituídas em `web/img/` para alterar o visual.
- Para ajustar o layout, edite o CSS em `web/css/styles.css`.
- Para modificar a lógica de exibição, altere `web/js/script.js`.

## Créditos

- Inspirado no painel do jogo/anime Initial D.
- Desenvolvido por mxet_.

---

**Este projeto está em desenvolvimento e sujeito a mudanças. Sinta-se livre para contribuir ou sugerir melhorias!**
