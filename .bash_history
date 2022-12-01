#!/bin/bash
if [ ! -z $CI ]; then echo "Executing run_all_tests.sh from $(pwd)"; fi
# ANSI colors
BOLD_GREEN='\033[1;32m'
BOLD_RED='\033[1;31m'
ANSI_RESET='\033[0m'
gh_actions_fold () {   local startOrEnd=$1 # Either "start" or "end"   if [ ! -z $CI ]; then     echo "::$startOrEnd::";   fi; }
# Find the Blockly project root if pwd is the root
# or if pwd is the directory containing this script.
if [ -f ./run_all_tests.js ]; then   BLOCKLY_ROOT=".."; elif [ -f tests/run_all_tests.sh ]; then   BLOCKLY_ROOT="."; else   echo -e "${BOLD_RED}ERROR: Cannot determine BLOCKLY_ROOT${ANSI_RESET}" 1>&2;   exit 1; fi
