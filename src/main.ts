import { BANTOM_CLASS } from './constants/weight';
import { updatePlayer } from './json';
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

    updatePlayer({
      id: 1,
      name: 'blang',
      style: {
        baseFight: '태권도',
      },
    });
  }
}

const app = new App();
