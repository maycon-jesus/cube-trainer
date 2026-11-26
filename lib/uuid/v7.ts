export function uuidv7(): string {
    const bytes = crypto.getRandomValues(new Uint8Array(16));

    // 48 bits de timestamp Unix em ms (big-endian) nos bytes 0..5
    let ts = Date.now();
    for (let i = 5; i >= 0; i--) {
        bytes[i] = ts % 256;
        ts = Math.floor(ts / 256);
    }

    bytes[6] = (bytes[6] & 0x0f) | 0x70; // versão 7
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // variante 10xx

    return formatUuid(bytes);
}

function formatUuid(bytes: Uint8Array): string {
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}