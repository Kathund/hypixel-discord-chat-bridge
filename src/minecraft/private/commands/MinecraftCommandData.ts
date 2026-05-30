import type MinecraftCommandDataOption from "./MinecraftCommandDataOption.js";
import type { CommandDataJSON } from "../../../types/minecraft.js";

class MinecraftCommandData {
  private name: string = "";
  private description: string | null = null;
  private aliases: string[] = [];
  private options: MinecraftCommandDataOption[] = [];

  setName(name: string): this {
    this.name = name;
    return this;
  }

  getName(): string {
    return this.name;
  }

  setDescription(description: string | null): this {
    this.description = description;
    return this;
  }

  getDescription(): string | null {
    return this.description;
  }

  setAliases(aliases: string[]): this {
    this.aliases = aliases;
    return this;
  }

  getAliases(): string[] {
    return this.aliases;
  }

  setOptions(options: MinecraftCommandDataOption[]): this {
    this.options = options;
    return this;
  }

  getOptions(): MinecraftCommandDataOption[] {
    return this.options;
  }

  toJSON(): CommandDataJSON {
    return { name: this.getName(), description: this.getDescription(), aliases: this.getAliases(), options: this.getOptions().map((option) => option.toJSON()) };
  }
}

export default MinecraftCommandData;
