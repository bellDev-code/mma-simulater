import { Fight } from './fight';

export class Stage {
  constructor(private fights: Fight[]) {}

  async start() {
    // forof 함수를 만드는게 아님.
    for (const fight of this.fights) {
      fight.play();
      // 함수 안에서만 먹히는 Promise() await 실행 된 함수 안에서만 기다린다.
      await new Promise((f) => setTimeout(f, 10000));
    }
  }

  // forEach()는 element 하나 당 하나의 함수를 생성하여 실행을 한다.
}
