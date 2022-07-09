import { Address } from "@graphprotocol/graph-ts";
import { Transfer } from "../generated/BEP20Token/BEP20Token";
import { BUSDTransaction, Player } from "../generated/schema";
import { BUCKET_WALLET_ADDRESSES } from "./constants";
import { loadOrCreatePlayer } from "./helpers/player";

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

  const playerAddress: Address = isWithdrawal
    ? event.params.to
    : event.params.from;
  const player: Player = loadOrCreatePlayer(playerAddress);

  const transaction = new BUSDTransaction(event.transaction.hash.toHex());
  transaction.player = player.id;
  transaction.value = event.params.value;
  transaction.type = isWithdrawal ? "WITHDRAWAL" : "DEPOSIT";
  transaction.createdAt = event.block.timestamp;
  transaction.blockNumber = event.block.number.toI32();
  transaction.save();
}
