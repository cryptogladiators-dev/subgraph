import { BigInt, log } from "@graphprotocol/graph-ts";
import { Item } from "../../generated/schema";

function idFromBigInt(id: BigInt): string {
  return id
    .toHexString()
    .slice(2)
    .padStart(64, "0");
}

export function loadItem(id: BigInt): Item | null {
  const idHex = idFromBigInt(id);
  return Item.load(idHex);
}

export function createItem(id: BigInt, amount: BigInt): Item {
  const idHex = idFromBigInt(id);
  const item = new Item(idHex);
  item.total = item.inStock = amount;
  item.save();
  return item;
}

export function mint(id: BigInt, amount: BigInt): Item {
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
  return item;
}

export function mintBatch(ids: BigInt[], amounts: BigInt[]): Item[] {
  const items: Item[] = [];
  for (let i = 0; i < ids.length; i++) {
    const item = mint(ids[i], amounts[i]);
    items.push(item);
  }
  return items;
}
