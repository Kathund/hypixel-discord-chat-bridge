# Hypixel Discord Chat Bridge

A two-way chat bridge between [Hypixel](https://hypixel.net/) guild chat and a [Discord](https://discord.com/) channel. The application utilizes
[discord.js v14](https://github.com/discordjs/discord.js) for communicating with Discord, and [mineflayer](https://github.com/PrismarineJS/mineflayer) for communicating
with Hypixel.

<!-- prettier-ignore -->
> [!WARNING]
> This software allows access to Hypixel using Mineflayer, a non-standard Minecraft client. Using this application carries the risk of your Minecraft account
> being banned from Hypixel. Therefore, use it at your own discretion. I hold no responsibility for any bans resulting from its usage.

<hr>

If you found this project helpful or interesting, please consider giving it a star. It helps other developers find the project and shows your appreciation for the work
that went into it. Thank you!

## Table of Content

- [Installation using NodeJS](#nodejs)
- [Installation using Docker](#docker)
- [Commands](#commands-2)
- [Configuration](#configuration)
- [To-Do List](#to-do-list)

## NodeJS

- Git
- NodeJS >= 20.18.3
- A Minecraft account

### Setup Guide for NodeJS

To get started, clone down the repository using:

    git clone https://github.com/DuckySoLucky/hypixel-discord-chat-bridge.git

Next go into the `hypixel-discord-chat-bridge` folder and install all the dependencies using NPM.

    npm install

While the dependencies are being installed you can edit the configuration file. The configuration file is called `config.example.json`. It is pretty self explanatory, but
if you need help with it, you can check out the [Configuration](#configuration) section. Once you are done editing, save it as another file by the name of `config.json`.
Both files are required for the bot to work.

Once edited and the dependencies are installed, you can start the application using:

    node index.js

Using the link provided in the console, you sign into the Minecraft account of your choice.

## Docker

### Requirements

- Git
- Docker >= 20<br> _Older versions may also work, but have not been tested._
- A Minecraft account

### Setup

In here we are going to clone the repository, set up the configuration file, volume directory, build the image, and run the container.

- Clone the repository and enter the directory:

      git clone https://github.com/DuckySoLucky/hypixel-discord-chat-bridge.git
      cd hypixel-discord-chat-bridge

- Configure the volume directories in /opt/ as `root`:

      mkdir -p /opt/docker/hypixel-discord-chat-bridge/data/
      mkdir -p /opt/docker/hypixel-discord-chat-bridge/auth-cache/

- Move the following files into the directory using:

      mv config.example.json /opt/docker/hypixel-discord-chat-bridge/config.json
      mv src/messages.json /opt/docker/hypixel-discord-chat-bridge/src/messages.json
      mv data/* /opt/docker/hypixel-discord-chat-bridge/data

- Change the ownership of the directory to the user you want to run the container as using:

      chown -R 1000:1000 /opt/docker/hypixel-discord-chat-bridge/

- Edit the configuration file called `config.json` in `/opt/docker/hypixel-discord-chat-bridge/` using the [Configuration](#configuration) section.

- Build the image using:

      docker build . -t hypixel-discord-chat-bridge:latest

- Once the image is built, you can run the container for the first time using:

      docker run -it \
          -v /opt/docker/hypixel-discord-chat-bridge/data:/usr/src/app/data \
          -v /opt/docker/hypixel-discord-chat-bridge/auth-cache:/usr/src/app/auth-cache \
          -v /opt/docker/hypixel-discord-chat-bridge/config.json:/usr/src/app/config.json \
          -v /opt/docker/hypixel-discord-chat-bridge/src/messages.json:/usr/src/app/src/messages.json \
          -v /etc/localtime:/etc/localtime:ro \
          --restart unless-stopped \
          --name hypixel-discord-chat-bridge \
          hypixel-discord-chat-bridge:latest

- Using the link provided in the console, sign in to the minecraft account that you want to use.

- Once you are signed in, you can stop the container using:

      Ctrl + C

- Now you can start the container using:

      docker start hypixel-discord-chat-bridge

## Credits

- [discord.js](https://discord.js.org)
- [mineflayer](https://prismarinejs.github.io/mineflayer)
- [Hypixel API](http://api.hypixel.net)
- [Hypixel API Reborn](https://github.com/Hypixel-API-Reborn/hypixel-api-reborn)
- [Mowojang API](https://mowojang.matdoes.dev)
- [DawJaw](https://dawjaw.net)
- [Soopy](https://soopy.dev)
