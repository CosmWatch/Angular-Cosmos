import { Inject } from "@angular/core";
import { WalletBase } from "./wallet/WalletBase";
import { KeplrWallet } from './keplr-wallet/keplr-wallet';
import CONSTANTS from './utils/constants';
const { DEFAULT_CHAIN_NAME } = CONSTANTS;

@Inject({
    providedIn: 'root'
})
export class WalletsInjector {
    // Add supported wallets here
    wallets: WalletBase[] = [
        new KeplrWallet(DEFAULT_CHAIN_NAME)
    ];
}