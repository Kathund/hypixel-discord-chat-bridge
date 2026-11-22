import ConfigManager from '../../src/ConfigManager.ts';
import '../../src/private/logger.ts';

await new ConfigManager().validateExampleConfig();
process.exit(0);
