import {
  BigInt,
  Address,
  log,
  crypto,
  ByteArray,
} from "@graphprotocol/graph-ts";
import { Item, Wallet, WalletOwnedItem } from "../../generated/schema";
import { loadOrCreateWallet } from "./wallet";

export function loadItem(id: string): Item | null {
  return Item.load(id);
}

export function createItem(id: string, amount: BigInt): Item {
  const item = new Item(id);
  item.total = amount;
  item.inStock = BigInt.zero();
  item.save();
  return item;
}

export function updateWalletOwnedItem(
  wallet: Wallet,
  item: Item,
  amount: BigInt,
  add: boolean = true
): WalletOwnedItem {
  const id = `${wallet.id}-${item.id}`;
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
  if (wallet.type == "GAME") {
    if (add) {
      item.inStock = item.inStock.plus(amount);
    } else {
      item.inStock = item.inStock.minus(amount);
    }
    item.save();
  }
  return walletOwnedItem;
}

export function mint(
  id: BigInt,
  address: Address,
  amount: BigInt,
  to: Address
): Item {
  log.info("Handling mint of {} {} with id {}", [
    amount.toString(),
    amount.equals(BigInt.fromI32(1)) ? "Item" : "Items",
    id.toString(),
  ]);
  const idWithAddress = `${address.toHex()}-${id.toString()}`;
  let item = loadItem(idWithAddress);
  const wallet = loadOrCreateWallet(to);
  if (!item) {
    item = createItem(idWithAddress, amount);
    updateWalletOwnedItem(wallet, item, amount);
    return item;
  }
  item.total = item.total.plus(amount);
  item.save();
  updateWalletOwnedItem(wallet, item, amount);
  return item;
}

export function mintBatch(
  ids: BigInt[],
  address: Address,
  amounts: BigInt[],
  to: Address
): Item[] {
  const items: Item[] = [];
  for (let i = 0; i < ids.length; i++) {
    const item = mint(ids[i], address, amounts[i], to);
    items.push(item);
  }
  return items;
}
