import { Transfer } from "../generated/BEP20Token/BEP20Token";
import { BUSDTransaction, Wallet } from "../generated/schema";
import { loadOrCreateWallet, walletType } from "./helpers/wallet";

export function handleTransfer(event: Transfer): void {
  if (
    walletType(event.params.from) == "PLAYER" &&
    walletType(event.params.to) == "PLAYER"
  ) {
    return;
  }

  const from: Wallet = loadOrCreateWallet(event.params.from);
  const to: Wallet = loadOrCreateWallet(event.params.to);

  const transaction = new BUSDTransaction(event.transaction.hash.toHex());
  transaction.from = from.id;
  transaction.to = to.id;
  transaction.value = event.params.value;
  transaction.createdAt = event.block.timestamp;
  transaction.blockNumber = event.block.number.toI32();
  transaction.save();
}
