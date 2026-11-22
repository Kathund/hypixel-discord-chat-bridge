import ConfigManager from '../../src/ConfigManager.ts';
import '../../src/private/logger.ts';

await new ConfigManager().validate();
process.exit(0);
