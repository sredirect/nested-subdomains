#!/bin/bash
set -e
STACKNAME=$(npx @cdk-turnkey/stackname@1.2.0 --suffix app)
echo "no integration tests defined"
