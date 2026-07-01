export type CubeData = {
    id: string,
    name: string,
}

export const cubesDefinition: Record<CubeData["id"], CubeData> = {
    "2x2x2": {
        id: "2x2x2",
        name: "2x2x2"
    },
    "3x3x3": {
        id: "3x3x3",
        name: "3x3x3"
    },
    "4x4x4": {
        id: "4x4x4",
        name: "4x4x4"
    },
    "5x5x5": {
        id: "5x5x5",
        name: "5x5x5"
    },
    "6x6x6": {
        id: "6x6x6",
        name: "6x6x6"
    },
    "7x7x7": {
        id: "7x7x7",
        name: "7x7x7"
    },
    "other": {
        id: "other",
        name: "Other"
    }
}