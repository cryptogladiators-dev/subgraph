import { Address } from "@graphprotocol/graph-ts";
import { Transfer } from "../generated/BEP20Token/BEP20Token";
import { BUSDTransaction, Player } from "../generated/schema";
import { BUCKET_WALLET_ADDRESSES } from "./constants";
import * as player from "./player";

export function handleTransfer(event: Transfer): void {
  let p: Player;
  let isGameTransaction = false;
  let isWithdrawal = false;

  for (let i = 0; i < BUCKET_WALLET_ADDRESSES.length; i++) {
    if (
      Address.fromHexString(BUCKET_WALLET_ADDRESSES[i]).equals(
        event.params.from
      )
    ) {
      isGameTransaction = true;
      isWithdrawal = true;
      break;
    } else if (
      Address.fromHexString(BUCKET_WALLET_ADDRESSES[i]).equals(event.params.to)
    ) {
      isGameTransaction = true;
      break;
    }
  }

  if (!isGameTransaction) {
    return;
  }

  if (isWithdrawal) {
    p = player.loadOrCreate(event.params.to);
  } else {
    p = player.loadOrCreate(event.params.from);
  }

  const transaction = new BUSDTransaction(event.transaction.hash.toHex());
  transaction.player = p.id;
  transaction.value = event.params.value;
  transaction.isWithdrawal = isWithdrawal;
  transaction.save();
}
