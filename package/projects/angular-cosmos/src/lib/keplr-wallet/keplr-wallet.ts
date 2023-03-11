/* eslint-disable @typescript-eslint/no-useless-constructor */
import { WalletBase } from '../wallet/WalletBase';
import { Window as KeplrWindow } from '@keplr-wallet/types';
import { WalletState } from '../wallet/WalletState';
import { OfflineSigner } from '@cosmjs/proto-signing';
import {
	SigningCosmWasmClient,
	SigningCosmWasmClientOptions,
} from '@cosmjs/cosmwasm-stargate';
import {
	GasPrice,
	SigningStargateClient,
	SigningStargateClientOptions,
} from '@cosmjs/stargate';
import CONSTANTS from '../utils/constants';
const { DEFAULT_GAS_PRICE } = CONSTANTS;

declare global {
	interface Window extends KeplrWindow {}
}

export class KeplrWallet extends WalletBase {
	private address?: string;
	private name?: string;
	private offlineSigner?: OfflineSigner;

	constructor(chainName: string = 'juno') {
		super(chainName);
		this.address = undefined;
		this.name = undefined;
		this.state = WalletState.READY;
	}

	public getWalletState(): WalletState {
		return this.state;
	}

	/**
	 * Returns the address of the connected wallet
	 * @returns {Promise<string>} address
	 * @default {string} ''
	 */
	public async getWalletAddress(): Promise<string> {
		if (this.state !== WalletState.CONNECTED || this.address === undefined) {
			await this.connect();
		}
		return this.address ?? '';
	}

	/**
	 * Returns the name of the connected wallet
	 * @returns {Promise<string>} name
	 * @default {string} ''
	 */
	public async getName(): Promise<string> {
		if (this.state !== WalletState.CONNECTED || this.name === undefined) {
			await this.connect();
		}
		return this.name ?? '';
	}

	/**
	 * Connects to Keplr wallet
	 * @returns {Promise<void>}
	 */
	public async connect(): Promise<void> {
		// Stop if wallet is already connected
		if (this.walletIsConnected()) {
			console.log('wallet is already connected');
			return;
		}

		// Stop if wallet is not ready
		if (!this.walletIsReady()) {
			console.log('wallet is not ready for connection');
			return;
		}

		console.log('connecting to wallet');
		this.state = WalletState.CONNECTING;

		if (!this.keplrIsAvailable()) {
			alert('Please install keplr extension');
		}

		try {
			// Enable wallet
			await this.enableKeplr();

			// Get offline signer and address
			if (this.getOfflineSigner !== undefined) {
				this.offlineSigner = this.getOfflineSigner();
				this.address = await this.getAddressFrom(this.offlineSigner);
			}
			// Get name from key
			this.name = await this.getNameFromKey();

			// Set the state to connected if we have an offline signer,
			// otherwise set to error
			if (this.walletIsConnected()) {
				this.state = WalletState.CONNECTED;
			}
		} catch (e: any) {
			console.error('Error connecting to wallet', e);
			this.state = WalletState.ERROR;
			if (e instanceof Error) this.errorMessage = e.message;
		}
	}

	disconnect(): void {
		this.state = WalletState.DISCONNECTING;
		this.address = undefined;
		this.offlineSigner = undefined;
		this.errorMessage = undefined;
		this.state = WalletState.DISCONNECTED;
	}

	async getSigningStargateClient(): Promise<SigningStargateClient | undefined> {
		if (this.state !== WalletState.CONNECTED) {
			throw new Error('Wallet is not connected');
		}

		const gasPrice = GasPrice.fromString(DEFAULT_GAS_PRICE);
		const options: SigningStargateClientOptions = {
			gasPrice,
		};

		if (this.offlineSigner !== undefined && this.walletIsConnected()) {
			const rpc = this.getRpc();
			if (rpc.length > 0) {
				return await SigningStargateClient.connectWithSigner(
					rpc,
					this.offlineSigner,
					options
				);
			} else {
				throw new Error('RPC is not defined');
			}
		} else {
			throw new Error(
				'Wallet is not connected: Offline signer is undefined or wallet is not connected'
			);
		}
	}

	async getSigningCosmWasmClient(): Promise<SigningCosmWasmClient | undefined> {
		if (this.state !== WalletState.CONNECTED) {
			throw new Error('Wallet is not connected');
		}

		const gasPrice = GasPrice.fromString(DEFAULT_GAS_PRICE);
		const options: SigningCosmWasmClientOptions = {
			gasPrice,
		};

		if (this.offlineSigner !== undefined && this.walletIsConnected()) {
			const rpc = this.getRpc();
			if (rpc.length > 0) {
				return await SigningCosmWasmClient.connectWithSigner(
					rpc,
					this.offlineSigner,
					options
				);
			} else {
				throw new Error('RPC is not defined');
			}
		} else {
			throw new Error(
				'Wallet is not connected: Offline signer is undefined or wallet is not connected'
			);
		}
	}

	walletIsConnected(): boolean {
		return this.offlineSigner !== undefined && this.address !== undefined;
	}

	keplrIsAvailable(): boolean {
		return window.getOfflineSigner != null || window.keplr != null;
	}

	async enableKeplr(): Promise<void> {
		await window.keplr?.enable(this.chainId);
	}

	getOfflineSigner(): OfflineSigner | undefined {
		if (window.getOfflineSigner != null) {
			return window.getOfflineSigner(this.chainId);
		} else {
			console.error('window.getOfflineSigner is null');
		}
		return undefined;
	}

	async getAddressFrom(
		offlineSigner?: OfflineSigner
	): Promise<string | undefined> {
		if (offlineSigner !== undefined) {
			const accounts = await offlineSigner?.getAccounts();
			if (accounts !== undefined) {
				return accounts[0].address;
			} else {
				console.error('accounts is undefined');
			}
		}
		return undefined;
	}

	async getNameFromKey(): Promise<string | undefined> {
		if (window.keplr == null) {
			throw new Error('Keplr not available');
		}

		try {
			return (await window.keplr.getKey(this.chainId)).name;
		} catch (e: any) {
			console.error('Error getting key name', e);
		}
		return undefined;
	}

	getRpc(): string {
		if (this.chainInfo.chain.apis?.rpc !== undefined) {
			return this.chainInfo.chain.apis?.rpc[0].address;
		}
		return '';
	}
}
