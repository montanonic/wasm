import wabt from "wabt";
import fs from "fs";

// Runs wasm build tools on a textual webassembly file (".wat"), outputting it
// as a binary ".wasm" file for consumption in JavaScript.
wabt().then(wabt => {
    const inputWat = "main.wat";
    const wasmModule = wabt.parseWat(inputWat, fs.readFileSync(inputWat, "utf8"));
    fs.writeFileSync("main.wasm", wasmModule.toBinary({}).buffer);
});
