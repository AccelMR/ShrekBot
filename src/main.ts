import { ShrekBot } from "./shrekBot";
import { ResourceManager } from "./resourceManager";
import { RemoteResources } from "./remoteResources";
 
//Loads Resources
ResourceManager.Instance.initialize();
RemoteResources.Instance.initialize();
RemoteResources.Instance.downloadAudios();

//Initialize this Discord App
const g_shrekBot: ShrekBot = new ShrekBot();
g_shrekBot.initialize();

//TODO list:
// - Make a queue for audios
// - Change hardcoded messages to a json so it can change depending on the language
