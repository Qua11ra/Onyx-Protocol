#!/bin/bash

GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'
CHECKMARK="✔"

CLEANED_UP=false

cleanup() {
    if [ "$CLEANED_UP" = true ]; then return; fi
    CLEANED_UP=true
    echo -e "\n${BLUE}━━━ Shutting down environment... ━━━${NC}"
    kill "$(jobs -p)" 2>/dev/null
    echo -e "${GREEN}${CHECKMARK} Done. Exiting.${NC}"
    exit 0
}

trap 'echo -e "${RED}${CROSS} Error occurred. Exiting...${NC}"; cleanup' ERR
trap cleanup SIGINT SIGTERM EXIT

clear
echo -e "${BLUE}${BOLD}┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓${NC}"
echo -e "${BLUE}${BOLD}┃      ONYX STABLECOIN INFRASTRUCTURE        ┃${NC}"
echo -e "${BLUE}${BOLD}┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛${NC}"

echo -e "${CYAN}${BOLD}STEP 1:${NC} Preparing Smart Contracts"
cd ./packages/\@onyx-blockchain/src/foundry || exit 1

echo -ne "  │ Cleaning artifacts... "
forge clean > /dev/null 2>&1
echo -e "${GREEN}Done${NC}"

echo -ne "  │ Building binaries... "
forge build > /dev/null 2>&1
echo -e "${GREEN}Done${NC}"

echo -e "\n${CYAN}${BOLD}STEP 2:${NC} Initializing Local Blockchain"
echo -ne "  │ Launching Anvil node... "
anvil --port 3000 > /dev/null 2>&1 &
ANVIL_PID=$!
sleep 2
echo -e "${GREEN}${CHECKMARK} Running [PID: $ANVIL_PID]${NC}"

echo -e "\n${CYAN}${BOLD}STEP 3:${NC} Orchestrating Deployment"
chmod +x ./Deploy.sh
./Deploy.sh | sed 's/^/  │ /'

echo -e "\n${CYAN}${BOLD}STEP 4:${NC} Launching Frontend Workspace"
cd ../../../../
echo -e "${GREEN}${CHECKMARK} Core systems ready. Initializing Turbo...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

pnpm dev