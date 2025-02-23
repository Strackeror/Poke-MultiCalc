import * as vm from "node:vm"
import * as fs from "node:fs/promises"

async function downloadFile(url: string): Promise<string> {
    const res = await fetch(url);
    const buffer = await res.text();
    return buffer
}

let context = vm.createContext({})
let buffer = await downloadFile("https://github.com/DarkShinyGiratina/Scrambled-Calc/raw/refs/heads/main/src/js/data/sets/gen9.js")
let script = new vm.Script(buffer)
script.runInContext(context)

fs.writeFile("./static/data/baseSets/gen9.json", JSON.stringify(context.SETDEX_SV, undefined, 4));

export { }