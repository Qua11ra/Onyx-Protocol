export const ONYX_HELPER_CONTRACT = {
  address: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
  abi: [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_onyxV3Aggregator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_wEth",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_wBtc",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_wEthPriceFeed",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_wBtcPriceFeed",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_fakeChainlinkAutomation",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "IS_SCRIPT",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getConfig",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct HelperConfig.NetworkConfig",
        "components": [
          {
            "name": "chainlinkPriceFeed",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "chainlinkAutomation",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "wEth",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "wBtc",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "wEthPriceFeed",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "wBtcPriceFeed",
            "type": "address",
            "internalType": "address"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getEthSepoliaNetworkConfig",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct HelperConfig.NetworkConfig",
        "components": [
          {
            "name": "chainlinkPriceFeed",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "chainlinkAutomation",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "wEth",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "wBtc",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "wEthPriceFeed",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "wBtcPriceFeed",
            "type": "address",
            "internalType": "address"
          }
        ]
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "getOrCreateAnvilNetworkConfig",
    "inputs": [
      {
        "name": "_onyxV3Aggregator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_wEth",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_wBtc",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_wEthPriceFeed",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_wBtcPriceFeed",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_fakeChainlinkAutomation",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct HelperConfig.NetworkConfig",
        "components": [
          {
            "name": "chainlinkPriceFeed",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "chainlinkAutomation",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "wEth",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "wBtc",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "wEthPriceFeed",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "wBtcPriceFeed",
            "type": "address",
            "internalType": "address"
          }
        ]
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "networkConfig",
    "inputs": [],
    "outputs": [
      {
        "name": "chainlinkPriceFeed",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "chainlinkAutomation",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "wEth",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "wBtc",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "wEthPriceFeed",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "wBtcPriceFeed",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "networkConfigs",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "chainlinkPriceFeed",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "chainlinkAutomation",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "wEth",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "wBtc",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "wEthPriceFeed",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "wBtcPriceFeed",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  }
]
} as const

export const ERC20MOCK_CONTRACT = {
  abi: [
  {
    "type": "constructor",
    "inputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "allowance",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "spender",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "approve",
    "inputs": [
      {
        "name": "spender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "burn",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "decimals",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint8",
        "internalType": "uint8"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "mint",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "name",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "symbol",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalSupply",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "transfer",
    "inputs": [
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferFrom",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "Approval",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "spender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Transfer",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "ERC20InsufficientAllowance",
    "inputs": [
      {
        "name": "spender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "allowance",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "needed",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC20InsufficientBalance",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "balance",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "needed",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC20InvalidApprover",
    "inputs": [
      {
        "name": "approver",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC20InvalidReceiver",
    "inputs": [
      {
        "name": "receiver",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC20InvalidSender",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC20InvalidSpender",
    "inputs": [
      {
        "name": "spender",
        "type": "address",
        "internalType": "address"
      }
    ]
  }
]
} as const
