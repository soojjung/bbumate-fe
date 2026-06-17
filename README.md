<p align="center">
  <img src="/public/thumbnail.png" alt="Thumbnail" width="800">
</p>

# BBUmate 👰🏻🤵🏻

"Newlywed Policy Counseling Chatbot" is an **AI counseling service that aggregates policy information scattered across various agencies using RAG, and recommends policies tailored to the user's situation** — covering housing, loans, welfare, and corporate benefits for newlyweds.

## 🚀 Deployment

- Live URL: https://en.bbumate.com/

## 🎧 Key Features

- **Onboarding**: Select your residential area and housing type (no home / jeonse / monthly rent / homeowner / other) to start a personalized consultation
- **Chat**: Communicates with the backend API to receive RAG-based responses, with auto-scroll to display the latest messages
- **Source Display**: Shows sources provided by the backend as clickable links
- **Consistent Design Tokens**: Manages button/icon/chat bubble colors via CSS variables

## ⚒️ Tech Stack

- React 18 + TypeScript 5
- Vite 5
- Tailwind CSS + shadcn/ui
- ESLint 9

## ✨ Getting Started

1. Clone the repository

   ```bash
   git clone <YOUR_REPO_URL>
   cd couple-navi
   ```

2. Node.js setup

   Node 22 is recommended as specified in `.nvmrc` at the project root.

- Using nvm

  ```bash
  nvm use        # Use the Node version from .nvmrc
  ```

- Without nvm

  - Install LTS (22) from the official Node.js website: `https://nodejs.org`

  - Or install via terminal (macOS Homebrew)

    ```bash
    brew install node@22
    brew link node@22 --force
    ```

- Installing nvm (macOS example)

  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  # Restart your terminal, then:
  nvm install 22
  ```

- Verify Node version

  ```bash
  node -v        # 22
  ```

- Install dependencies and run

  ```bash
  npm install    # Install dependencies
  npm run dev    # Start the development server
  ```

## 💻 Environment Variables

To change the backend API URL (optional): set it in `.env` at the project root

```bash
VITE_API_BASE=FRONTEND_API_BASE_URL
```
