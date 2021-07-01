import { Fight } from './fight';
import { PlayerInstance } from './player';

const FIGHT_TERM = 5000;

export class Stage {
  winners?: PlayerInstance[];
  constructor(private fights: Fight[]) {}

  // 지금은 제대로 되어있는거 아님.
  async start() {
    const winners = [];
    // forof 함수를 만드는게 아님. => index가 없다.
    for (let i = 0; i < this.fights.length; i++) {
      const fight = this.fights[i];

      const { winer } = await fight.play();
      winners.push(winer);

      if (i === this.fights.length - 1) {
        console.log(`모든 경기가 끝났습니다.`);
        break;
      }
      console.log(
        `${i + 1}번째 경기가 끝났습니다. ${(FIGHT_TERM / 1000).toFixed(
          2,
        )}초 후 다음 경기가 이어집니다.`,
      );
      await new Promise((f) => setTimeout(f, FIGHT_TERM));
    }

    this.winners = winners;

    // for (const fight of this.fights) {
    //   await fight.play();
    //   // 함수 안에서만 먹히는 Promise() await 실행 된 함수 안에서만 기다린다.
    //   await new Promise((f) => setTimeout(f, 10000));
    // }
  }

  // forEach()는 element 하나 당 하나의 함수를 생성하여 실행을 한다.
}
