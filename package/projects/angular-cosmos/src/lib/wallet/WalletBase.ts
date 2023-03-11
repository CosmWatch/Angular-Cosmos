import { WalletState } from './WalletState';
import { registry } from '../utils/chain-registry';
import { ChainInfo } from '@chain-registry/client/types/registry';

export class WalletBase {
	public state: WalletState = WalletState.NOT_READY;
	public chainInfo: ChainInfo;
	public chainId: string;
	public errorMessage?: string;

	constructor(chainName: string) {
		if (chainName == null) {
			throw new Error('Chain name is required');
		}

		this.chainInfo = registry.getChainInfo(chainName);
		this.chainId = this.chainInfo.chain.chain_id;
	}

	walletIsReady(): boolean {
		return this.state === WalletState.READY;
	}
}
