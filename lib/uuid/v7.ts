/**
 * Creates a UUIDv7 (RFC 9562) generator with a 12-bit counter in `rand_a` (method 1), so IDs
 * produced by the same generator are strictly increasing even within the same millisecond.
 * `timestamp` defaults to now; pass one to mint IDs for past records (in ascending order).
 */
export function createUuidv7Generator() {
    let lastTs = 0
    let seq = 0

    return (timestamp: number = Date.now()): string => {
        const bytes = crypto.getRandomValues(new Uint8Array(16));

        let ts = timestamp;
        if (ts <= lastTs) {
            // Same ms (or clock went backwards): keep the last timestamp and bump the counter.
            ts = lastTs;
            seq++;
            if (seq > 0xfff) {
                ts = ++lastTs;
                seq = 0;
            }
        } else {
            lastTs = ts;
            seq = 0;
        }

        // 48 bits de timestamp Unix em ms (big-endian) nos bytes 0..5
        for (let i = 5, t = ts; i >= 0; i--) {
            bytes[i] = t % 256;
            t = Math.floor(t / 256);
        }

        bytes[6] = 0x70 | (seq >> 8); // versão 7 + 4 bits altos do contador
        bytes[7] = seq & 0xff;        // 8 bits baixos do contador
        bytes[8] = (bytes[8]! & 0x3f) | 0x80; // variante 10xx

        return formatUuid(bytes);
    }
}

const defaultGenerator = createUuidv7Generator()

export function uuidv7(): string {
    return defaultGenerator()
}

function formatUuid(bytes: Uint8Array): string {
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
