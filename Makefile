babbage := ./CIPs/CIP-0116/cardano-babbage.json

format:
	jq '.' ${babbage} > temp.json && mv temp.json ${babbage}
