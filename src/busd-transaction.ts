import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Transfer } from "../generated/BEP20Token/BEP20Token";
import { BUSDTransaction, Player } from "../generated/schema";
import * as player from "./player";

export function handleTransfer(event: Transfer): void {
  const bucketWalletAddresses: string[] = [
    "0xcc21Bc565fED141A434b1730885efbc692A130F9", // localhost
    "0x00574b151CB66D51b444597c6a4BbF1a44eE5fe9", // dev
  ];
  let p: Player;
  let transaction: BUSDTransaction;
  let isGameTransaction = false;
  let isWithdrawal = false;

  for (let i = 0; i < bucketWalletAddresses.length; i++) {
    if (
      Address.fromHexString(bucketWalletAddresses[i]).equals(event.params.from)
    ) {
      isGameTransaction = true;
      isWithdrawal = true;
      break;
    } else if (
      Address.fromHexString(bucketWalletAddresses[i]).equals(event.params.to)
    ) {
      isGameTransaction = true;
      break;
    }
  }

  if (!isGameTransaction) {
    return;
  }

  if (isWithdrawal) {
    p = player.loadOrCreate(event.params.to);
  } else {
    p = player.loadOrCreate(event.params.from);
  }

  transaction = new BUSDTransaction(event.transaction.hash.toHex());
  transaction.player = p.id;
  transaction.value = event.params.value;
  transaction.isWithdrawal = isWithdrawal;
  transaction.save();
}
