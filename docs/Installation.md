# Installation Guide

## Manual Setup

### Prerequisites

- [Git](https://git-scm.com/install)
- [Node.js](https://nodejs.org/en/download) >= v22.22.3
- [pnpm](https://pnpm.io/installation) >= v11.0.0
- [A Minecraft account](https://minecraft.net)

### Installation Steps

1. Clone the repository:

```bash
   git clone https://github.com/DuckySoLucky/hypixel-discord-chat-bridge.git
   cd hypixel-discord-chat-bridge
```

2. Install dependencies:

```bash
   pnpm install --frozen-lockfile
```

3. Create your configuration:
   - Copy `config.example.json` to `config.json`
   - Edit `config.json` with your settings (see [Configuration](Configuration.md) for help)

4. Start the bot:

```bash
   pnpm start
```

To sign into a minecraft account please see the [FAQ](./FAQ.md#how-do-i-add-a-minecraft-account) questio we have on it

---

## Docker

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) >= 20
  - Older versions may also work, but have not been tested.
- [A Minecraft account](https://minecraft.net)

1. Clone the repository:

```bash
   git clone https://github.com/DuckySoLucky/hypixel-discord-chat-bridge.git
   cd hypixel-discord-chat-bridge
```

2. Build the Docker image:

```bash
   docker build . -t hypixel-discord-chat-bridge:latest
```

3. Run the container with mounted data and config:

```bash
   docker run -d \
     -v "$PWD/config.json:/app/config.json" \
     -v "$PWD/data:/app/data" \
     -v "$PWD/auth-cache:/app/auth-cache" \
     -v "$PWD/logs:/app/logs" \
     --restart unless-stopped \
     --name hypixel-discord-chat-bridge \
     hypixel-discord-chat-bridge:latest
```

4. Stop and remove the container when needed:

```bash
   docker stop hypixel-discord-chat-bridge
   docker rm hypixel-discord-chat-bridge
```

5. Start it again:

```bash
   docker start hypixel-discord-chat-bridge
```

To sign into a Minecraft account please see the [FAQ](./FAQ.md#how-do-i-add-a-minecraft-account) question.

---

If you still need help consider checking out the [FAQ](FAQ.md). Feel free to reach out to the maintainers directly on Discord.
[@duckysolucky](https://discord.com/users/486155512568741900) and [@.kathund](https://discord.com/users/1276524855445164098)
