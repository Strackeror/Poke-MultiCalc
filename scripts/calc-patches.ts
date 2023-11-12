import patched_files from './patched-files.json';
import * as fs from 'fs';
import { exec as execSync } from 'child_process';
import { promisify } from "util"

let exec = promisify(execSync);

function getPatchPath(target: string) {
	return target + '.patch';
}

async function apply(source: string, target: string) {
	let file_content = await fs.promises.readFile(source);
	await exec(`git apply ${getPatchPath(target)}`);
	await fs.promises.writeFile(source, file_content);
}

async function makePatch(source: string, target: string) {
  await exec(`git diff --no-index --patch ${source} ${target} --output=${getPatchPath(target)}`)
}


for (let [source, target] of patched_files) {
  if (process.argv[2] == "apply") {
    apply(source, target);
  }
  if (process.argv[2] == "make") {
    makePatch(source, target);
  }
}