import fs from "node:fs/promises";

const types = new Set();

function tokens(line: string): string[] {
   return line.split(/\s+/);
}

async function analyze(filename: string){
   const data = await fs.readFile(filename);
   const lines = data.toString().split(/\r?\n/).filter(x => x !== '');
   
   for (let index = 0; index < lines.length; index++){
      const line = lines[index].trim();
      const first = line[0];
      
      // Skip text and closing node
      if (first === '>' || first === '|') continue;
      
      if (first === '<'){
         types.add(tokens(line.substring(1))[0] + ' chunk');
      } else {
         const name = tokens(line)[0];
   
         if (/^[A-Z]+$/.test(name)){
            types.add(name);
         }
      }
   }
}

await analyze('./test/project-midi.RPP');
await analyze('./test/project-empty.RPP');
await analyze('./test/midi-toggle-editor.RPP');

const list = [...types].sort();

for (const item of list){
   console.log(item);
}
