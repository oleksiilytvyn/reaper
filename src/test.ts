import { readReaperFile, writeReaperString } from "~/file/io";

const node = await readReaperFile('./test/project-empty.RPP').catch(reason => reason);
const text = await writeReaperString(node).catch(reason => reason);

console.log(node.toString());
