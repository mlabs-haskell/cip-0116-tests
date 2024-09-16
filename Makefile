babbage := ./CIPs/CIP-0116/cardano-babbage.json
conway := ./CIPs/CIP-0116/cardano-conway.json

format:
	jq '.' ${babbage} > temp.json && mv temp.json ${babbage}
	jq '.' ${conway} > temp.json && mv temp.json ${conway}
