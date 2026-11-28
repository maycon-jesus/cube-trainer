<template>
    <v-container>
        <v-btn @click="startRcp">test</v-btn>
        <v-text-field :model-value="val"></v-text-field>
        <v-text-field v-model="ans" label="Answer"></v-text-field>
        <v-btn @click="serverConnect">connect to client</v-btn>
    </v-container>
</template>

<script lang="ts" setup>
const val = ref()
const ans = ref()
const peer = shallowRef<RTCPeerConnection>()
const channel = shallowRef<RTCDataChannel>()

function waitIceComplete(pc: RTCPeerConnection) {
    if (pc.iceGatheringState === 'complete') return Promise.resolve()
    return new Promise<void>(resolve => {
        pc.addEventListener('icegatheringstatechange', () => {
            if (pc.iceGatheringState === 'complete') resolve()
        })
    })
}

async function startRcp() {
    peer.value = new RTCPeerConnection({
        iceServers: [
            { urls: "stun:stun.cloudflare.com:3478" },
            { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"] },
            { urls: "stun:global.stun.twilio.com:3478" },
            { urls: "stun:stun.nextcloud.com:443" }
        ],
        iceCandidatePoolSize: 1,
        bundlePolicy: 'max-bundle',
        rtcpMuxPolicy: 'require'
    })

    peer.value.onicecandidate = (ev) => {
        val.value = JSON.stringify(peer.value?.localDescription)
    }

    channel.value = peer.value.createDataChannel("testechannel", {
        negotiated: true,
        id: 0,
        ordered: false,
    })

    let pingTime = 0
    const ping = () => {
        pingTime = Date.now()
        channel.value?.send("ping")
    }

    channel.value.addEventListener("open", () => {
        channel.value?.send("ola mundo")
        ping()
    })

    channel.value.addEventListener("message", (ev) => {
        if (ev.data === "pong") {
            console.log("Ping: ", Date.now() - pingTime)
            ping()
        }
    })

    const offer = await peer.value.createOffer()
    await peer.value.setLocalDescription(offer)
    await waitIceComplete(peer.value)

    val.value = JSON.stringify(peer.value.localDescription)


}

async function serverConnect() {
    await peer.value?.setRemoteDescription(JSON.parse(ans.value))
}
</script>