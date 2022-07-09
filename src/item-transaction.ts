import { Address } from "@graphprotocol/graph-ts";
import {
  TransferBatch,
  TransferSingle,
} from "../generated/CryptoGladiatorsItems/CryptoGladiatorsItems";
import { ItemTransaction, Player } from "../generated/schema";
import { BUCKET_WALLET_ADDRESSES } from "./constants";
import { loadOrCreatePlayer } from "./helpers/player";

export function handleTransferSingle(event: TransferSingle): void {
  const from: Player = loadOrCreatePlayer(event.params.from);
  const to: Player = loadOrCreatePlayer(event.params.to);
  let isGameTransaction = false;

  for (let i = 0; i < BUCKET_WALLET_ADDRESSES.length; i++) {
    if (
      Address.fromHexString(BUCKET_WALLET_ADDRESSES[i]).equals(
        event.params.from
      )
    ) {
      isGameTransaction = true;
      break;
    }
  }

  if (!isGameTransaction) {
    return;
  }

  const transaction = new ItemTransaction(event.transaction.hash.toHex());
  transaction.from = from.id;
  transaction.to = to.id;
  transaction.items = [event.params.id];
  transaction.values = [event.params.value];
  transaction.type = "SINGLE";
  transaction.isGameTransaction = isGameTransaction;
  transaction.save();
}

export function handleTransferBatch(event: TransferBatch): void {
  const from: Player = loadOrCreatePlayer(event.params.from);
  const to: Player = loadOrCreatePlayer(event.params.to);
  let isGameTransaction = false;

  for (let i = 0; i < BUCKET_WALLET_ADDRESSES.length; i++) {
    if (
      Address.fromHexString(BUCKET_WALLET_ADDRESSES[i]).equals(
        event.params.from
      )
    ) {
      isGameTransaction = true;
      break;
    }
  }

  if (!isGameTransaction) {
    return;
  }

  const transaction = new ItemTransaction(event.transaction.hash.toHex());
  transaction.from = from.id;
  transaction.to = to.id;
  transaction.items = event.params.ids;
  transaction.values = event.params.values;
  transaction.type = "BATCH";
  transaction.isGameTransaction = isGameTransaction;
  transaction.save();
}
