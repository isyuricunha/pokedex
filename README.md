# 🎮 PokéDex - Explore o Mundo dos Pokémon

Uma aplicação web moderna e minimalista para consultar informações sobre Pokémon, usando a [PokéAPI](https://pokeapi.co/) como fonte de dados.

## ✨ Features

- 📱 **Interface Minimalista**: Design moderno com tema preto puro e acento laranja escuro
- 🔍 **Busca em Tempo Real**: Pesquise Pokémon por nome ou número
- 📊 **Informações Detalhadas**: Estatísticas base, habilidades, tipos e muito mais
- 🔄 **Cadeia de Evolução**: Visualize a linha evolutiva completa
- ⚡ **Performance Otimizada**: Server-Side Rendering (SSR) e cache inteligente
- 📱 **Responsivo**: Design mobile-first que funciona em todos os dispositivos
- ♿ **Acessível**: Navegação por teclado e suporte a screen readers

## 🛠️ Tech Stack

- **Framework**: [Next.js 15.5.4](https://nextjs.org/) (App Router)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Package Manager**: [PNPM](https://pnpm.io/)
- **API**: [PokéAPI](https://pokeapi.co/)

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- PNPM (recomendado) ou npm/yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/pokedex.git
cd pokedex
```

2. Instale as dependências:
```bash
pnpm install
```

3. Execute o servidor de desenvolvimento:
```bash
pnpm dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📁 Estrutura do Projeto

```
/app
  /(routes)
    /page.tsx              # Página inicial com listagem
    /pokemon/[id]/page.tsx # Página de detalhes
  /layout.tsx              # Layout raiz
  /globals.css             # Estilos globais
/components
  /pokemon                 # Componentes específicos de Pokémon
    /PokemonCard.tsx
    /PokemonList.tsx
    /TypeBadge.tsx
    /StatBar.tsx
    /EvolutionChain.tsx
  /ui                      # Componentes base de UI
    /SearchBar.tsx
    /Pagination.tsx
    /LoadingCard.tsx
/lib
  /api                     # Funções de integração com API
    /pokeapi.ts
  /types                   # Tipos TypeScript
    /pokemon.ts
```

## 🎨 Design System

### Paleta de Cores

- **Background Primary**: `#000000` (Preto Puro)
- **Background Secondary**: `#0A0A0A`
- **Accent**: `#FF8C00` (Laranja Escuro)
- **Accent Hover**: `#FFA500`
- **Text Primary**: `#FFFFFF`
- **Text Secondary**: `#A0A0A0`
- **Border**: `#1A1A1A`

## 📝 Scripts Disponíveis

```bash
pnpm dev      # Inicia o servidor de desenvolvimento com Turbopack
pnpm build    # Cria a build de produção
pnpm start    # Inicia o servidor de produção
pnpm lint     # Executa o linter
```

## 🚀 Deploy

O projeto está otimizado para deploy na [Vercel](https://vercel.com):

1. Faça push do código para o GitHub
2. Conecte seu repositório na Vercel
3. A Vercel irá detectar automaticamente o Next.js e fazer o deploy

Alternativamente, você pode fazer deploy manual:

```bash
pnpm build
pnpm start
```

## 📄 Licença

Este projeto foi criado para fins educacionais.

## 🙏 Agradecimentos

- [PokéAPI](https://pokeapi.co/) - Pela incrível API pública
- [Next.js](https://nextjs.org/) - Pelo framework React poderoso
- Comunidade Pokémon - Pelo amor eterno aos Pokémon

---

Feito com ❤️ por fãs de Pokémon
