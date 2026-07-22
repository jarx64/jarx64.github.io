export const script1 = {
  count: 0,
  clickAction() {
    console.log(`something ${this.count++}`);
  },
}