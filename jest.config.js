/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js", "json"],
  testMatch: ["**/tests/**/*.test.ts"],
  rootDir: "./",
  displayName: {
    name: "File Translation Tests",
    color: "blue",
  },
  verbose: true
 };