import BasicInteractionData from "../BasicInteractionData.ts";
import { BasicInteractionResponse, type DiscordManagerWithClient, type ModalSubmitInteractionWithGuild } from "../../../types/discord.ts";
import type DiscordManager from "../../DiscordManager.ts";
import type DiscordModalData from "./DiscordModalData.ts";

abstract class DiscordModal<Manager extends DiscordManager = DiscordManagerWithClient> extends BasicInteractionData<Manager> {
  abstract readonly data: DiscordModalData;
  response: BasicInteractionResponse = BasicInteractionResponse.Ephemeral;

  abstract execute(interaction: ModalSubmitInteractionWithGuild): Promise<void>;
}

export default DiscordModal;
