import { Injectable } from '@angular/core';
import { WalletBase } from './wallet/WalletBase';
import { KeplrWallet } from './keplr-wallet/keplr-wallet';
import CONSTANTS from './utils/constants';
import { WalletsInjector } from './wallets.injector';
import { Observable, of } from 'rxjs';
const { DEFAULT_CHAIN_NAME } = CONSTANTS;

@Injectable({
  providedIn: 'root'
})
export class AngularCosmosService {

  activeChain: string = DEFAULT_CHAIN_NAME;
  activeWallet?: WalletBase = this.walletsInjector.wallets[0];

  constructor(private walletsInjector: WalletsInjector) {}

  // TODO: Here, users can invoke functions (as observables) of the currently selected wallet.
  /** Supported functions:
  * - connect$()
  * - disconnect$()
  * - getWalletState$()
  * - getWalletName$()
  * - getWalletAddress$()
  * - getSigningStargateClient$()
  * - getSigningCosmWasmClient$()
  */

  connect$(): Observable<Promise<void>> {
    return of(this.activeWallet?.connect());
  }
}
