---
description: Guia de Depuração de Orquestração Single-SPA (Webpack + Vite no Windows)
---

# Guia de Orquestração Starian

Este guia descreve como integrar o `root-config` (Webpack/SystemJS) com o `spa-people` (Vite/ESM) resolvendo erros comuns de rede e sintaxe no Windows.

## 📋 Diagnóstico de Erros

### 1. SyntaxError: Cannot use import statement outside a module
**Causa:** O SystemJS tenta carregar o arquivo virtual do Vite como um script IIFE, mas ele contém instruções `import`.
**Solução:** 
- Usar a entrada virtual `/%40vite-plugin-single-spa/entry.js`.
- Adicionar o extra `systemjs/extras/module-types.min.js` no `index.ejs`.
- No Import Map local, usar a URL absoluta com porta `http://localhost:8080/`.

### 2. 404 Not Found no entry.js
**Causa:** O `@` é um caractere especial no Windows/URL. 
**Solução:** 
- Codificar `@` como `%40` no Import Map.
- Garantir que o `vite-plugin-single-spa` tenha `type: 'mife'` nas configurações do SPA.

## 🛠️ Configuração Recomendada

### spa-people/vite.config.ts
```typescript
vitePluginSingleSpa({
  type: 'mife',
  serverPort: 8080,
  spaEntryPoints: 'src/main.ts', // Ponto de entrada do microfrontend
})
```

### root-config/src/index.ejs
```html
<script src="https://unpkg.com/systemjs@6.15.1/dist/extras/module-types.min.js"></script>
<script type="systemjs-importmap">
{
  "imports": {
    "@starian/spa-people": "http://localhost:8080/%40vite-plugin-single-spa/entry.js"
  }
}
</script>
```

## 🔍 Passo-a-Passo de Debug
// turbo
1. Verifique `curl http://localhost:8080/%40vite-plugin-single-spa/entry.js`. O retorno deve conter `System.register`.
2. Verifique o console do navegador: se houver `ReferenceError: System is not defined`, mova o carregamento do `system.min.js` para o topo do `<head>`.
3. Verifique o `starian-root-config.ts`: o `loadApp` deve retornar `System.import(name)`.
