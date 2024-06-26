#!/bin/bash

# Run cleanup ports first
yarn run cleanup-ports

# Run the test environment setup and Cypress tests
start-server-and-test setup-test-env 127.0.0.1:5173 cypress:run
TEST_EXIT_CODE=$?

# Always run cleanup ports after tests
yarn run cleanup-ports

# Exit with the same code as the Cypress tests
exit $TEST_EXIT_CODE
