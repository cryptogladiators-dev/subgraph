import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Transfer } from "../generated/BEP20Token/BEP20Token";
import {
  DepositTransaction,
  Player,
  WithdrawalTransaction,
} from "../generated/schema";
import * as player from "./player";

export function handleTransfer(event: Transfer): void {
  const bucketWalletAddresses: string[] = [
    "0xcc21Bc565fED141A434b1730885efbc692A130F9", // localhost
    "0x00574b151CB66D51b444597c6a4BbF1a44eE5fe9", // dev
  ];
  let p: Player;
  let isWithdrawal = false;

  for (let i = 0; i < bucketWalletAddresses.length; i++) {
    if (
      Address.fromHexString(bucketWalletAddresses[i]).equals(event.params.from)
    ) {
      isWithdrawal = true;
      break;
    }
  }

  if (isWithdrawal) {
    // Withdrawal Transaction
    p = player.loadOrCreate(event.params.to);
    const transaction = new WithdrawalTransaction(
      event.transaction.hash.toHex()
    );
    transaction.player = p.id;
    transaction.value = event.params.value;
    transaction.save();
  } else {
    // Deposit Transaction
    p = player.loadOrCreate(event.params.from);
    const transaction = new DepositTransaction(event.transaction.hash.toHex());
    transaction.player = p.id;
    transaction.value = event.params.value;
    transaction.save();
  }
}
