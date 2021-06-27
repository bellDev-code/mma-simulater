import { BANTOM_CLASS } from './constants/weight';
import { League } from './league';
import { PlayerInstance } from './player';
import player from './resources/player.json';

class App {
  constructor() {
    const playerInstance = player.players.map((player) => {
      return new PlayerInstance(player);
    });
    const newLeague = new League(4, BANTOM_CLASS);

    newLeague.joinPlayers(playerInstance);
    newLeague.start('winCount');
  }
}

const app = new App();
