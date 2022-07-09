import { Address } from "@graphprotocol/graph-ts";
import { Player } from "../../generated/schema";

export function loadOrCreatePlayer(address: Address): Player {
  let player = Player.load(address.toHex());

  if (!player) {
    player = new Player(address.toHex());
    player.save();
  }

  return player;
}
