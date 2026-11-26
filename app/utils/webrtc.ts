// Poucos STUN rápidos: cada servidor extra atrasa o fim do ICE gathering
export const rtcConfig: RTCConfiguration = {
    iceServers: [
        { urls: 'stun:stun.cloudflare.com:3478' },
        { urls: 'stun:stun.l.google.com:19302' },
    ],
    bundlePolicy: 'max-bundle',
    rtcpMuxPolicy: 'require',
}

// Canal negociado fora de banda (sem handshake DCEP) e não confiável/sem ordem:
// sem head-of-line blocking nem retransmissão — ideal para ping/tempo real.
export const fastChannelInit: RTCDataChannelInit = {
    negotiated: true,
    id: 0,
    ordered: false,
    maxRetransmits: 0,
}

export function createFastChannel(pc: RTCPeerConnection) {
    const ch = pc.createDataChannel('fast', fastChannelInit)
    ch.binaryType = 'arraybuffer'
    return ch
}

/**
 * Espera o ICE gathering terminar, mas no máximo `timeoutMs`.
 * Como a sinalização é copiar/colar (sem trickle), não vale esperar STUN lento.
 */
export function waitIceGathering(pc: RTCPeerConnection, timeoutMs = 1500) {
    if (pc.iceGatheringState === 'complete') return Promise.resolve()
    return new Promise<void>((resolve) => {
        const done = () => {
            clearTimeout(timer)
            pc.removeEventListener('icegatheringstatechange', onState)
            pc.removeEventListener('icecandidate', onCandidate)
            resolve()
        }
        const onState = () => pc.iceGatheringState === 'complete' && done()
        const onCandidate = (ev: RTCPeerConnectionIceEvent) => !ev.candidate && done()
        const timer = setTimeout(done, timeoutMs)
        pc.addEventListener('icegatheringstatechange', onState)
        pc.addEventListener('icecandidate', onCandidate)
    })
}
