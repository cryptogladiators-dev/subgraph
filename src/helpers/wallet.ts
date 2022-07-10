import { Address } from "@graphprotocol/graph-ts";
import { Wallet } from "../../generated/schema";
import { BUCKET_WALLET_ADDRESSES } from "../constants";

export function walletType(address: Address): string {
  return BUCKET_WALLET_ADDRESSES.includes(address.toHexString())
    ? "GAME"
    : "PLAYER";
}

export function loadOrCreateWallet(address: Address): Wallet {
  let wallet = Wallet.load(address.toHex());

  if (!wallet) {
    wallet = new Wallet(address.toHex());
    wallet.type = walletType(address);
    wallet.save();
  }

  return wallet;
}
