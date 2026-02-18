#!/bin/bash
set -e

GREEN='\033[0;32m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

DEPLOYER_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

echo -e "${CYAN}Executing Forge script...${NC}"

DEPLOY_OUTPUT=$(forge script script/DeployOnyx.s.sol --rpc-url http://127.0.0.1:3000 --private-key "$DEPLOYER_PRIVATE_KEY" --broadcast)

TOKEN_ADDR=$(echo "$DEPLOY_OUTPUT" | grep "onyxTokenAddress: address" | awk '{print $NF}')
ENGINE_ADDR=$(echo "$DEPLOY_OUTPUT" | grep "onyxStablecoinEngineAddress: address" | awk '{print $NF}')
HELPER_ADDR=$(echo "$DEPLOY_OUTPUT" | grep "helperConfigAddress: address" | awk '{print $NF}')

echo -e "${GREEN}${BOLD}Deployment Success:${NC}"
echo -e "  ✦ Token:  ${BOLD}$TOKEN_ADDR${NC}"
echo -e "  ✦ Engine: ${BOLD}$ENGINE_ADDR${NC}"
echo -e "  ✦ Helper: ${BOLD}$HELPER_ADDR${NC}"

ONYX_CONTRACTS_FILE="../contracts/onyx-contracts.ts"
TOOLS_CONTRACTS_FILE="../contracts/tools-contracts.ts"

TOKEN_ABI_FILE=$(jq '.abi' "./out/OnyxToken.sol/OnyxToken.json")
ENGINE_ABI_FILE=$(jq '.abi' "./out/OnyxStablecoinEngine.sol/OnyxStablecoinEngine.json")
HELPER_ABI_FILE=$(jq '.abi' "./out/HelperConfig.s.sol/HelperConfig.json")
ERC20MOCK_ABI_FILE=$(jq '.abi' "./out/ERC20Mock.sol/ERC20Mock.json")

cat <<EOF > $ONYX_CONTRACTS_FILE
export const ONYX_TOKEN_CONTRACT = {
  address: "$TOKEN_ADDR",
  abi: $TOKEN_ABI_FILE
} as const

export const ONYX_ENGINE_CONTRACT = {
  address: "$ENGINE_ADDR",
  abi: $ENGINE_ABI_FILE
} as const
EOF

cat << EOF > $TOOLS_CONTRACTS_FILE
export const ONYX_HELPER_CONTRACT = {
  address: "$HELPER_ADDR",
  abi: $HELPER_ABI_FILE
} as const

export const ERC20MOCK_CONTRACT = {
  abi: $ERC20MOCK_ABI_FILE
} as const
EOF

echo -e "\n${CYAN}TypeScript Synchronization:${NC}"
echo -e "  ${GREEN}✔${NC} Protocol config updated"
echo -e "  ${GREEN}✔${NC} Tooling mocks updated"