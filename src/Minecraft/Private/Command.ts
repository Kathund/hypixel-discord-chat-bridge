import { Delay, GenerateId } from "../../Utils/MiscUtils.js";
import { SplitMessage } from "../../Utils/StringUtils.js";
import type CommandData from "./CommandData.js";
import type { ChatMessage } from "prismarine-chat";
import type { MinecraftManagerWithBot } from "../../Types/Minecraft.js";

enum SendErrorType {
  RATE_LIMITED = "rate-limited",
  DUPLICATE_MESSAGE = "duplicate-message"
}

class SendError extends Error {
  constructor(public type: SendErrorType) {
    super(type);
  }
}

class Command<T extends MinecraftManagerWithBot = MinecraftManagerWithBot> {
  protected readonly minecraft: T;
  data!: CommandData;
  officer: boolean = false;
  MAX_MESSAGE_LENGTH: number;
  MAX_EXECUTION_TIME: number;
  SEND_TIMEOUT: number;
  RETRY_DELAY: number;
  DUPLICATE_DELAY: number;
  constructor(minecraft: T) {
    this.minecraft = minecraft;
    this.MAX_MESSAGE_LENGTH = 256;
    this.MAX_EXECUTION_TIME = 10_000;
    this.SEND_TIMEOUT = 500;
    this.RETRY_DELAY = 2_000;
    this.DUPLICATE_DELAY = 100;
  }

  getArgs(message: string): string[] {
    const args = message.split(" ");
    args.shift();
    return args;
  }

  async send(message: string, maxRetries = 5, isErrorMessage = false): Promise<void> {
    const startTime = Date.now();

    const hasTimedOut = () => Date.now() - startTime > this.MAX_EXECUTION_TIME;

    // Split oversized messages
    if (message.length > this.MAX_MESSAGE_LENGTH) {
      const messages = SplitMessage(message, this.MAX_MESSAGE_LENGTH);

      for (const part of messages) {
        if (hasTimedOut()) return console.error("Message sending timed out after 10 seconds");
        await Delay(1000);
        await this.send(part, maxRetries, isErrorMessage);
      }

      return;
    }

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        await this.sendMessage(message);
        return;
      } catch (error) {
        if (hasTimedOut()) return console.error("Message sending timed out after 10 seconds");

        if (!(error instanceof SendError)) return console.error("Unexpected send error:", error);

        switch (error.type) {
          case SendErrorType.RATE_LIMITED: {
            const isLastAttempt = attempt === maxRetries - 1;

            if (isLastAttempt) {
              await this.send(`Command failed to send message after ${maxRetries} attempts. Please try again later.`, 1, true);
              if (!isErrorMessage) console.error(`Failed to send message after ${maxRetries} attempts due to rate limiting.`);
              return;
            }

            await Delay(this.RETRY_DELAY);
            break;
          }
          case SendErrorType.DUPLICATE_MESSAGE: {
            await Delay(this.DUPLICATE_DELAY);
            const randomId = GenerateId(this.minecraft.app.config.minecraft.bot.messageRepeatBypassLength);
            const maxLength = this.MAX_MESSAGE_LENGTH - randomId.length - 3;
            message = `${message.slice(0, maxLength)} - ${randomId}`;
            break;
          }
          default: {
            break;
          }
        }
      }
    }
  }

  private sendMessage(message: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const listener = (rawMessage: ChatMessage) => {
        const message = rawMessage.toString();

        if (message.includes("You are sending commands too fast!") && !message.includes(":")) {
          // eslint-disable-next-line no-use-before-define
          cleanup();
          reject(new SendError(SendErrorType.RATE_LIMITED));
          return;
        }

        if (message.includes("You cannot say the same message twice!") && !message.includes(":")) {
          // eslint-disable-next-line no-use-before-define
          cleanup();
          reject(new SendError(SendErrorType.DUPLICATE_MESSAGE));
        }
      };

      const cleanup = () => this.minecraft.bot.removeListener("message", listener);

      this.minecraft.bot.once("message", listener);
      this.minecraft.bot.chat(`/${this.officer ? "oc" : "gc"} ${message}`);

      setTimeout(() => {
        cleanup();
        resolve();
      }, this.SEND_TIMEOUT);
    });
  }

  execute(username: string, message: string): Promise<void> | void {
    throw new Error("Execute Method not implemented!");
  }
}

export default Command;
