import {
	ChainRegistryFetcher,
	ChainRegistryFetcherOptions,
} from '@chain-registry/client';

const options: ChainRegistryFetcherOptions = {
	urls: [
		'https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/chain.json',
		'https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/assetlist.json',
		'https://raw.githubusercontent.com/cosmos/chain-registry/master/juno/assetlist.json',
		'https://raw.githubusercontent.com/cosmos/chain-registry/master/secretnetwork/assetlist.json',
		'https://raw.githubusercontent.com/cosmos/chain-registry/master/_IBC/juno-osmosis.json',
		'https://raw.githubusercontent.com/cosmos/chain-registry/master/_IBC/osmosis-secretnetwork.json',
	],
};
export const registry = new ChainRegistryFetcher(options);
