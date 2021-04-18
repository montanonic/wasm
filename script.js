async function main() {
    const wasmSource = await WebAssembly.instantiateStreaming(fetch('main.wasm'));
    const { add } = wasmSource.instance.exports;
    document.body.textContent = `
        ${add(Number.MAX_SAFE_INTEGER, 33)}`;
}

main();
