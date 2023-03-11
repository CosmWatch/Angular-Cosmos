/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Injectable } from '@angular/core';
import { KeplrWallet } from './keplr-wallet';
import { Observable, of } from 'rxjs';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { filter } from 'rxjs/operators';
import { SigningStargateClient } from '@cosmjs/stargate';
import { WalletState } from '../wallet/WalletState';

@Injectable({
	providedIn: 'root',
})
export class KeplrWalletService extends KeplrWallet {
	constructor() {
		super();
	}

	public connect$(): Observable<Promise<void>> {
		return of(this.connect());
	}

	public disconnect$(): Observable<void> {
		return of(this.disconnect());
	}

	public getWalletState$(): Observable<WalletState> {
		return of(this.getWalletState());
	}

	public getWalletName$(): Observable<Promise<string>> {
		return of(this.getName());
	}

	public getWalletAddress$(): Observable<Promise<string>> {
		return of(this.getWalletAddress());
	}

	public getSigningStargateClient$(): Observable<
		Promise<SigningStargateClient | undefined>
	> {
		return of(this.getSigningStargateClient()).pipe(
			filter((client) => client !== undefined)
		);
	}

	public getSigningCosmWasmClient$(): Observable<
		Promise<SigningCosmWasmClient | undefined>
	> {
		return of(this.getSigningCosmWasmClient()).pipe(
			filter((client) => client !== undefined)
		);
	}
}
