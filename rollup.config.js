
import resolve from "@rollup/plugin-node-resolve";

const output = [
    {
        file: "./dist/cinnamon-stick.js",
        format: "esm"
    }
]

export default {
    input: "./src/main.js",
    output,
    plugins: [
        resolve()
    ],
    watch: {
        exclude: "node_modules/**"
    }
}
