import { Address } from "@graphprotocol/graph-ts";
import { Transfer } from "../generated/BEP20Token/BEP20Token";
import { BUSDTransaction, Player } from "../generated/schema";
import { BUCKET_WALLET_ADDRESSES } from "./constants";
import * as player from "./player";

export function handleTransfer(event: Transfer): void {
  let isGameTransaction = false;
  let isWithdrawal = false;

  for (let i = 0; i < BUCKET_WALLET_ADDRESSES.length; i++) {
    if (
      Address.fromHexString(BUCKET_WALLET_ADDRESSES[i]).equals(
        event.params.from
      )
    ) {
      isWithdrawal = true;
      isGameTransaction = true;
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

  const playerAddress: Address = isWithdrawal
    ? event.params.to
    : event.params.from;
  const p: Player = player.loadOrCreate(playerAddress);

  const transaction = new BUSDTransaction(event.transaction.hash.toHex());
  transaction.player = p.id;
  transaction.value = event.params.value;
  transaction.type = isWithdrawal ? "WITHDRAWAL" : "DEPOSIT";
  transaction.save();
}
