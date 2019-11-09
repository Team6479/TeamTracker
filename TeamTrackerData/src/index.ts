// import * as fs from 'fs';
import axios from 'axios';

interface MainConfig {
    defaultGameYear: string;
    defaultEvent: string;
    yearsDir: string;
    eventsDir: string;
}

interface YearConfig {
    displays: Array<{
        graph: Array<{
            tableColumn: string;
            title: string;
            action: string;
        }>;
        list: Array<{
            tableColumn: string;
            title: string;
            action: string;
        }>;
        table: Array<{
            tableColumn: string;
            title: string;
        }>;
        filter: Array<{
            tableColumn: string;
            title: string;
            action: string;
        }>;
    }>;
}

var mainConfig: MainConfig;
var yearConfig: YearConfig;

// const mainConfig: MainConfig = JSON.parse(fs.readFileSync('./data/config.json').toString());
// const yearConfig: YearConfig = JSON.parse(fs.readFileSync(`./data/${mainConfig.yearsDir}/${mainConfig.defaultGameYear}/config.json`).toString());

var actionsScript = document.createElement('script');
actionsScript.onload = function () {
    console.log("HEllo")
};
actionsScript.src = `./data/${mainConfig.yearsDir}/actions.js`;

document.head.appendChild(actionsScript);

interface ActionCache {
    [tableColumn: string]: { [action: string]: number; };
};
/**
 * Used for storing results from actions to prevent redundancy
 */
export var actionCache: ActionCache = {}

for(var display of yearConfig.displays) {

}
