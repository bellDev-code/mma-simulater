import { BANTOM_LIMIT, HEAVY_LIMIT } from './constants/weight';
import { League } from './league';
import { PlayerInstance } from './player';

class App {
  constructor() {
    const newLeague = new League(4, {
      name: 'bantam',
      limit: HEAVY_LIMIT,
    });

    const newPlayer = new PlayerInstance(
      'lee',
      172,
      80,
      {
        attack: 100,
        defence: 80,
        hp: 100,
      },
      {
        baseFight: 'boxing',
        etc: ['kickBoxing'],
      },
    );

    newLeague.joinPlayers(newPlayer);
    newLeague.joinPlayers([newPlayer, newPlayer, newPlayer]);
  }
}

const app = new App();
