<template>
    <v-container>
        <v-text-field v-model="val"></v-text-field>
        <v-btn @click="connect">connect</v-btn>
        <v-text-field v-model="ans"></v-text-field>
    </v-container>
</template>

<script lang="ts" setup>
const val = ref()
const ans = ref()
const peer = ref<RTCPeerConnection>()

function waitIceComplete(pc: RTCPeerConnection) {
    if (pc.iceGatheringState === 'complete') return Promise.resolve()
    return new Promise<void>(resolve => {
        pc.addEventListener('icegatheringstatechange', () => {
            if (pc.iceGatheringState === 'complete') resolve()
        })
    })
}

async function connect() {
    peer.value = new RTCPeerConnection({
        iceServers: [
            { urls: "stun:stun.cloudflare.com:3478" },
            { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"] },
            { urls: "stun:global.stun.twilio.com:3478" },
            { urls: "stun:stun.nextcloud.com:443" }
        ]
    })

    let count = 0
    peer.value.onicecandidate = (ev) => {
        console.log("candidate ", ++count, ev)
    }

    peer.value.ondatachannel = ev => {
        const ch = ev.channel
        ch.onopen = () => {
            ch.send("olá do client")
        }
        ch.onmessage = e => {
            if (e.data === "ping") {
                ch.send("pong")
                return
            }
            console.log("client recebeu:", e.data)
        }
    }
    peer.value.onconnectionstatechange = () => {
        console.log("estado:", peer.value?.connectionState)
        console.log(peer.value?.sctp?.maxMessageSize)
    }

    await peer.value.setRemoteDescription(JSON.parse(val.value))
    const answer = await peer.value.createAnswer()
    await peer.value.setLocalDescription(answer)
    await waitIceComplete(peer.value)
    ans.value = JSON.stringify(peer.value.localDescription)

}
</script>