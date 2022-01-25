module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  setupFilesAfterEnv: [
    "jest-extended/all"
  ],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    }
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
}
