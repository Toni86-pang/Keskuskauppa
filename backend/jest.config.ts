import type { Config } from "@jest/types"

const config: Config.InitialOptions = {
	preset: "ts-jest",
	testEnvironment: "node",
	testPathIgnorePatterns: ["tests/oldProductTests/", "tests/users.test.ts"]
}

export default config
