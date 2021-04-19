async function main(importObject = {}) {
    const wasmSource = await WebAssembly.instantiateStreaming(fetch('main.wasm'), importObject);
    const { add } = wasmSource.instance.exports;
    document.body.textContent = `
        ${add(Number.MAX_SAFE_INTEGER, 33)}`;
}

main({
    console: {
        log: (arg) => console.log(arg)
    }
});
