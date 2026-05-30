import type { CommandDataOptionJSON } from "../../../types/minecraft.js";

class MinecraftCommandDataOption {
  private name: string = "";
  private description: string | null = null;
  private required: boolean = false;

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

  setRequired(required: boolean): this {
    this.required = required;
    return this;
  }

  getRequired(): boolean {
    return this.required;
  }

  toJSON(): CommandDataOptionJSON {
    return { name: this.getName(), description: this.getDescription(), required: this.getRequired() };
  }
}

export default MinecraftCommandDataOption;
