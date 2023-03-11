import { NgModule } from '@angular/core';
import { KeplrWalletModule } from './keplr-wallet/keplr-wallet.module';
import { WalletsInjector } from './wallets.injector';

@NgModule({
  imports: [
    KeplrWalletModule
  ],
  exports: [
    KeplrWalletModule
  ],
  providers: [
    WalletsInjector
  ],
})
export class AngularCosmosModule { }
