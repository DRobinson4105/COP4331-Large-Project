export default {
    transform: {},
    extensionsToTreatAsEsm: [".ts", ".tsx"],
    transform: {
        "^.+\\.[tj]sx?$": "babel-jest"
    }
}