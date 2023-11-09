import { getRarityColor, formatUsername } from "../../contracts/helperFunctions.js";
import { getLatestProfile } from "../../../API/functions/getLatestProfile.js";
import { minecraftCommand } from "../../contracts/minecraftCommand.js";
import { uploadImage } from "../../contracts/API/imgurAPI.js";
import { renderLore } from "../../contracts/renderItem.js";
import { getPets } from "../../../API/stats/pets.js";

export class PetCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "pet";
    this.aliases = ["pets"];
    this.description = "Renders active pet of specified user.";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false,
      },
    ];
  }

  async onCommand(username, message) {
    try {
      username = this.getArgs(message)[0] || username;

      const data = await getLatestProfile(username);

      username = formatUsername(username, data.profileData?.game_mode);

      const profile = getPets(data.profile);

      const pet = profile.pets.find((pet) => pet.active === true);

      if (pet === undefined) {
        return this.send(`/gc ${username} does not have pet equipped.`);
      }

      const renderedItem = await renderLore(
        `§7[Lvl ${pet.level}] §${getRarityColor(pet.tier)}${pet.display_name}`,
        pet.lore
      );

      const upload = await uploadImage(renderedItem);

      return this.send(`/gc ${username}'s Active Pet: ${upload.data.link ?? "Something went Wrong.."}`);
    } catch (error) {
      console.log(error);
      this.send(`/gc [ERROR] ${error}`);
    }
  }
}
