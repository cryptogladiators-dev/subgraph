import {
  TransferBatch,
  TransferSingle,
} from "../generated/CryptoGladiatorsItems/CryptoGladiatorsItems";
import { Item, ItemTransaction, Wallet } from "../generated/schema";
import { loadOrCreateWallet } from "./helpers/wallet";
import {
  loadItem,
  mint,
  mintBatch,
  updateWalletOwnedItem,
} from "./helpers/item";
import { Address } from "@graphprotocol/graph-ts";

export function handleTransferSingle(event: TransferSingle): void {
  if (event.params.from.equals(Address.zero())) {
    mint(event.params.id, event.params.value, event.params.to);
    return;
  }

  const item = loadItem(event.params.id)!;
  const from: Wallet = loadOrCreateWallet(event.params.from);
  const to: Wallet = loadOrCreateWallet(event.params.to);

  const transaction = new ItemTransaction(event.transaction.hash.toHex());
  transaction.from = from.id;
  transaction.to = to.id;
  transaction.items = [item.id];
  transaction.values = [event.params.value];
  transaction.type = "SINGLE";
  transaction.createdAt = event.block.timestamp;
  transaction.blockNumber = event.block.number.toI32();
  transaction.save();

  updateWalletOwnedItem(from, item, event.params.value, false);
  updateWalletOwnedItem(to, item, event.params.value, true);
}

export function handleTransferBatch(event: TransferBatch): void {
  if (event.params.from.equals(Address.zero())) {
    mintBatch(event.params.ids, event.params.values, event.params.to);
    return;
  }

  const items: Item[] = [];
  const itemIds: string[] = [];
  for (let i = 0; i < event.params.ids.length; i++) {
    const item: Item = loadItem(event.params.ids[i])!;
    items.push(item);
    itemIds.push(item.id);
  }
  const from: Wallet = loadOrCreateWallet(event.params.from);
  const to: Wallet = loadOrCreateWallet(event.params.to);

  const transaction = new ItemTransaction(event.transaction.hash.toHex());
  transaction.from = from.id;
  transaction.to = to.id;
  transaction.items = itemIds;
  transaction.values = event.params.values;
  transaction.type = "BATCH";
  transaction.createdAt = event.block.timestamp;
  transaction.blockNumber = event.block.number.toI32();
  transaction.save();

  for (let i = 0; i < items.length; i++) {
    updateWalletOwnedItem(from, items[i], event.params.values[i], false);
    updateWalletOwnedItem(to, items[i], event.params.values[i], true);
  }
}
