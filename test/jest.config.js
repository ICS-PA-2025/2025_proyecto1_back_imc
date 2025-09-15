module.exports = {
  rootDir: '../',
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/main.ts",
  ],
  testMatch: [
    "**/src/**/*.spec.ts",
    "**/test/**/*.spec.ts",
    "**/test/**/*.e2e-spec.ts"
  ],
  coverageDirectory: "./coverage",
  moduleFileExtensions: ["js", "json", "ts"],
  testEnvironment: "node",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest"
  },
};