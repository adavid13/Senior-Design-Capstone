export default class PlayerModel {
  constructor(number, playerType, faction) {
    this.number = number;
    this.playerType = playerType;
    this.faction = faction;
  }

  getNumber() {
    return this.number;
  }

  getPlayerType() {
    return this.playerType;
  }

  getFaction() {
    return this.faction;
  }
}
