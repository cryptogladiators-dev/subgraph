import {
  TransferBatch,
  TransferSingle,
} from "../generated/CryptoGladiatorsItems/CryptoGladiatorsItems";
import { ItemTransaction, Player } from "../generated/schema";
import { BUCKET_WALLET_ADDRESSES } from "./constants";
import { loadOrCreatePlayer } from "./helpers/player";
import { loadItem, mint, mintBatch } from "./helpers/item";
import { Address } from "@graphprotocol/graph-ts";

export function handleTransferSingle(event: TransferSingle): void {
  if (event.params.from.equals(Address.zero())) {
    mint(event.params.id, event.params.value);
    return;
  }
  const itemId = loadItem(event.params.id)!.id;
  const from: Player = loadOrCreatePlayer(event.params.from);
  const to: Player = loadOrCreatePlayer(event.params.to);
  const isGameTransaction = !!BUCKET_WALLET_ADDRESSES.includes(
    event.params.from.toHexString()
  );

  const transaction = new ItemTransaction(event.transaction.hash.toHex());
  transaction.from = from.id;
  transaction.to = to.id;
  transaction.items = [itemId];
  transaction.values = [event.params.value];
  transaction.type = "SINGLE";
  transaction.isGameTransaction = isGameTransaction;
  transaction.createdAt = event.block.timestamp;
  transaction.blockNumber = event.block.number.toI32();
  transaction.save();
}

export function handleTransferBatch(event: TransferBatch): void {
  if (event.params.from.equals(Address.zero())) {
    mintBatch(event.params.ids, event.params.values);
    return;
  }
  const itemIds: string[] = [];
  for (let i = 0; i < event.params.ids.length; i++) {
    const itemId = loadItem(event.params.ids[i])!.id;
    itemIds.push(itemId);
  }
  const from: Player = loadOrCreatePlayer(event.params.from);
  const to: Player = loadOrCreatePlayer(event.params.to);
  const isGameTransaction = !!BUCKET_WALLET_ADDRESSES.includes(
    event.params.from.toHexString()
  );

  const transaction = new ItemTransaction(event.transaction.hash.toHex());
  transaction.from = from.id;
  transaction.to = to.id;
  transaction.items = itemIds;
  transaction.values = event.params.values;
  transaction.type = "BATCH";
  transaction.isGameTransaction = isGameTransaction;
  transaction.createdAt = event.block.timestamp;
  transaction.blockNumber = event.block.number.toI32();
  transaction.save();
}
