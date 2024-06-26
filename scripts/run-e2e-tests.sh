#!/bin/bash

# Run cleanup ports first
yarn run cleanup-ports

# Run the test environment setup and Cypress tests
yarn run setup-test-env &

# wait for the dev server and firebase emulator to start
wait-on -l -v tcp:5173 && wait-on -l -v tcp:9099 && wait-on -l -v tcp:8080

# Run the Cypress tests
yarn run cypress:run
TEST_EXIT_CODE=$?

# Always run cleanup ports after tests
yarn run cleanup-ports

# Exit with the same code as the Cypress tests
exit $TEST_EXIT_CODE
