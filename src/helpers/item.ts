import {
  BigInt,
  Address,
  log,
  crypto,
  ByteArray,
} from "@graphprotocol/graph-ts";
import { Item, Wallet, WalletOwnedItem } from "../../generated/schema";
import { loadOrCreateWallet } from "./wallet";

function createItemID(id: BigInt): string {
  return id
    .toHexString()
    .slice(2)
    .padStart(64, "0");
}

function createWalletOwnedItemID(wallet: Wallet, item: Item): string {
  const id = ByteArray.fromHexString(wallet.id).concat(
    ByteArray.fromHexString(item.id)
  );
  return crypto.keccak256(id).toHexString();
}

export function loadItem(id: BigInt): Item | null {
  const idHex = createItemID(id);
  return Item.load(idHex);
}

export function createItem(id: BigInt, amount: BigInt): Item {
  const idHex = createItemID(id);
  const item = new Item(idHex);
  item.total = item.inStock = amount;
  item.save();
  return item;
}

export function updateWalletOwnedItem(
  wallet: Wallet,
  item: Item,
  amount: BigInt,
  add: boolean = true
): WalletOwnedItem {
  const id = createWalletOwnedItemID(wallet, item);
  let walletOwnedItem = WalletOwnedItem.load(id);
  if (!walletOwnedItem) {
    walletOwnedItem = new WalletOwnedItem(id);
    walletOwnedItem.wallet = wallet.id;
    walletOwnedItem.item = item.id;
    walletOwnedItem.amount = BigInt.zero();
  }
  if (add) {
    walletOwnedItem.amount = walletOwnedItem.amount.plus(amount);
  } else {
    walletOwnedItem.amount = walletOwnedItem.amount.minus(amount);
  }
  walletOwnedItem.save();
  return walletOwnedItem;
}

export function mint(id: BigInt, amount: BigInt, to: Address): Item {
  log.info("Handling mint of {} {} with id {}", [
    amount.toString(),
    amount.equals(BigInt.fromI32(1)) ? "Item" : "Items",
    id.toString(),
  ]);
  const item = loadItem(id);
  if (!item) {
    return createItem(id, amount);
  }
  item.total = item.total.plus(amount);
  item.inStock = item.inStock.plus(amount);
  item.save();
  const wallet = loadOrCreateWallet(to);
  updateWalletOwnedItem(wallet, item, amount);
  return item;
}

export function mintBatch(
  ids: BigInt[],
  amounts: BigInt[],
  to: Address
): Item[] {
  const items: Item[] = [];
  for (let i = 0; i < ids.length; i++) {
    const item = mint(ids[i], amounts[i], to);
    items.push(item);
  }
  return items;
}
