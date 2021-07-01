import { BANTOM_CLASS } from './constants/weight';
import { League } from './league';
import { PlayerInstance } from './player';
import player from './resources/player.json';

class App {
  // 리그 시뮬레이터 시작! 대다수 프로그래밍이 이렇다.
  constructor() {
    const playerInstance = player.players.map((player) => {
      return new PlayerInstance(player);
    });

    const newLeague = new League(4, BANTOM_CLASS);

    newLeague.joinPlayers(playerInstance);

    newLeague.start('winCount');
  }
}

// 부전승 전적 남기기

const app = new App();
