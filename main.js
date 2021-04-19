import wabt from "wabt";
import fs from "fs";

// Runs wasm build tools on a textual webassembly file (".wat"), outputting it
// as a binary ".wasm" file for consumption in JavaScript.
wabt().then(wabt => {
    const inputWat = "main.wat";
    const wasmModule = wabt.parseWat(inputWat, fs.readFileSync(inputWat, "utf8"),
        {});

    // wasmModule.generateNames();
    // console.log(wasmModule.toText({}));

    const binary = wasmModule.toBinary({});
    fs.writeFileSync("main.wasm", binary.buffer);

    // Direct testing in node.
    const module = WebAssembly.instantiate(binary.buffer);
    module.then(wasmSource => {
        const { incArr, memory, newArr } = wasmSource.instance.exports;
        let res = niceMultiline(`
        ${newArr(10, 9)}
        ${incArr(0, 10)}
        `);
        console.log(res);

        // check for nonzero values
        console.log('check buffer for nonzero values');
        let arr = new Uint32Array(memory.buffer);
        for (let i = 0; i < arr.length; i++) {
            let val = arr[i]
            if (val !== 0) {
                console.log(`index: ${i}: ${val}`);
            }
        }

        let ptr = 0
        console.log(lookupArray(arr, ptr, 10));
    })
});

function lookupArray(memory, ptr, length) {
    return memory.slice(ptr, length);
}

function niceMultiline(str) {
    return str.trim().split('\n').map(x => x.trim()).join('\n');
}
