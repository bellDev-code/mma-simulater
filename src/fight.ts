import { PlayerInstance } from './player';

const FITHT_PLAYER_LIMIT = 2;

export class Fight {
  constructor(public players: PlayerInstance[]) {
    if (players.length > FITHT_PLAYER_LIMIT) {
      throw new Error(`player max limit is ${FITHT_PLAYER_LIMIT}`);
    }
  }

  play() {
    // 배열의 0 index에 해당하는 element를 바로 변수명 선언하는 방법
    const [red, blue] = this.players;

    const redPower = red.player.stats.attack + red.player.stats.defence;
    const bluePower = blue.player.stats.attack + blue.player.stats.defence;

    while (red.player.stats.hp > 0 && blue.player.stats.hp > 0) {
      blue.player.stats.hp -= redPower;
      console.log(
        `${red.player.name}의 강력한 오른쪽 스트레이트! ${blue.player.name}에게 적중합니다! (hp -${redPower})`,
      );
    }
  }
}
