module.exports = {
  rootDir: "../../src",
  moduleFileExtensions: ["js", "json", "ts"],
  testEnvironment: "node",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": ["ts-jest", { tsconfig: "<rootDir>/../tsconfig.json" }]
  },
  setupFilesAfterEnv: ["@mdreal/nestjs-grammy-testing/jest"]
};
