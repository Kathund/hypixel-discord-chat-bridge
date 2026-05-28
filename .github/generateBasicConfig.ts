import { readFileSync, writeFileSync } from 'node:fs';

const exampleConfig = JSON.parse(readFileSync('config.example.json', 'utf-8'));
exampleConfig.minecraft.guild.requirements.requirements = { level: 1 };
exampleConfig.verification.roles.custom = [{ enabled: true, roleId: 'ROLE_ID', requirements: [{ type: 'guildRank', value: 'EXAMPLE' }] }];
exampleConfig.statsChannels.channels = [{ id: 'CHANNEL_ID', name: 'Guild Level: {guildLevel}' }];
writeFileSync('config.json', JSON.stringify(exampleConfig, null, 2));
