export default class PieceModel {
  constructor(number, type) {
    this.type = type;
    this.number = number;
  }

  getType() {
    return this.type;
  }
  
  getNumber() {
    return this.number;
  }
}
