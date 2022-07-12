import { Address } from "@graphprotocol/graph-ts";
import { Wallet } from "../../generated/schema";
import { BUCKET_WALLET_ADDRESSES } from "../constants";

export function walletType(address: Address): string {
  let type = "PLAYER";
  for (let i = 0; i < BUCKET_WALLET_ADDRESSES.length; i++) {
    if (
      BUCKET_WALLET_ADDRESSES[i].toLowerCase() ==
      address.toHexString().toLowerCase()
    ) {
      type = "GAME";
      break;
    }
  }
  return type;
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
