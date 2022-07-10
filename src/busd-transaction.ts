import { Transfer } from "../generated/BEP20Token/BEP20Token";
import { BUSDTransaction, Wallet } from "../generated/schema";
import { BUCKET_WALLET_ADDRESSES } from "./constants";
import { loadOrCreateWallet } from "./helpers/wallet";

export function handleTransfer(event: Transfer): void {
  let isGameTransaction = false;
  let isWithdrawal = false;

  if (BUCKET_WALLET_ADDRESSES.includes(event.params.from.toHexString())) {
    isGameTransaction = true;
    isWithdrawal = true;
  } else if (BUCKET_WALLET_ADDRESSES.includes(event.params.to.toHexString())) {
    isGameTransaction = true;
  }

  if (!isGameTransaction) {
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
