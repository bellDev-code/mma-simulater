import { Fight } from './fight';
import { PlayerInstance } from './player';
import { Stage } from './stage';
import { Weight } from './types/weight';

type RaffleMethod = 'pov' | 'winCount' | 'loseCount';

// 객체 지향, class 선언했다.

interface ILeague {
  weightClass: Weight;
  stage?: Stage;

  joinPlayers: (players: PlayerInstance | PlayerInstance[]) => void;
}

// implements 구현하다! 팀원과의 협력과 재사용성에 좋다.
// class가 해당 interface를 필수적으로 구현하게끔 한다.
export class League implements ILeague {
  stage?: Stage;
  playerInstances: PlayerInstance[] = [];
  scoreList: PlayerInstance[][] = [];

  constructor(private matchLength: number, public weightClass: Weight) {}

  async start(raffleMethod: RaffleMethod) {
    // 배열 ... 하는 이유 : 메모리 참조로 새로운 배열을 만들어서 기존의 값을 건드리지 않고
    // 새로운 객체를 만들기 위해서.
    // 불변성
    let players = [...this.playerInstances];

    while (players.length > 1) {
      const fights = this.raffleFight(players, raffleMethod);
      const stage = new Stage(fights);
      await stage.start();
      const winners = stage.winners;
      const losers = stage.losers;

      if (winners == null || losers == null) {
        throw new Error(`critical error`);
      }

      this.scoreList.push(losers);

      players = winners;
    }

    this.scoreList.push([players[0]]);

    const champion = players[0];
    console.log(`이번 리그의 챔피언은 ${champion.player.name}입니다!`);
    console.log(this.scoreList);
    this.calScore(this.scoreList);
  }

  private calScore(scoreList: PlayerInstance[][]) {
    for (let i = 0; i < scoreList.length; i++) {
      const players = scoreList[i];

      players.forEach((player) => {
        const score = (i + 1) * 100;
        console.log(`${player.player.name} 이번 리그 점수`, score);
      });
    }
  }

  raffleFight(players: PlayerInstance[], raffleMethod: RaffleMethod) {
    let sortedPlayers: PlayerInstance[] = [];
    switch (raffleMethod) {
      case 'pov':
        sortedPlayers = players.sort((a, b) => a.player.grade.pov - b.player.grade.pov);
        break;
      case 'winCount':
        sortedPlayers = players.sort((a, b) => b.player.grade.total.win - a.player.grade.total.win);
        break;
      case 'loseCount':
        sortedPlayers = players.sort(
          (a, b) => b.player.grade.total.lose - a.player.grade.total.lose,
        );
        break;
      default:
        throw new Error(`${raffleMethod} is not raffle method 😂`);
    }
    const fights = this.createFights(sortedPlayers);

    this.printFightRaffle(fights);
    return fights;
  }

  createFights(players: PlayerInstance[]) {
    const fights: Fight[] = [];

    for (let i = 0; i < players.length; i += 2) {
      fights.push(new Fight([players[i], players[i + 1]]));
    }

    return fights;
  }

  printFightRaffle(fights: Fight[]) {
    fights.forEach((fight, index) => {
      console.log(`조 추점 ${index + 1}조`);
      fight.players.forEach((player) => {
        console.log(`${player.player.name} 선수`);
      });
    });
  }

  // 위의 private matchLength와 같다.
  // private matchLength: number;
  // constructor(matchLength: number) {
  //   this.matchLength = matchLength;
  // }

  private checkPlayer(PlayerInstance: PlayerInstance) {
    const difference = this.weightClass.limit.difference || 0;
    if (this.weightClass.limit.weightLimit + difference < PlayerInstance.player.weight) {
      throw new Error(
        `해당 리그에 참여할 수 없는 플레이어입니다. (league weight class ${this.weightClass.name})`,
      );
    }
  }

  joinPlayers(playerInstances: PlayerInstance | PlayerInstance[]) {
    // if (typeof playerInstances === 'object')
    // 자바스크립트에서 구현해놓은 Array class로 배열인지 확인할 수 있다.
    if (Array.isArray(playerInstances)) {
      playerInstances.forEach((player) => this.checkPlayer(player));

      if (playerInstances.length + this.playerInstances.length > this.matchLength) {
        throw new Error('플레이어 인원 초과입니다.');
      }
      this.playerInstances.push(...playerInstances);
    } else {
      this.checkPlayer(playerInstances);
      if (this.playerInstances.length + 1 > this.matchLength)
        this.playerInstances.push(playerInstances);
    }
  }
}

// export class UFC implements ILeague {
//   constructor(public weightClass: Weight) {}
//   joinPlayers(players: Player | Player[]) {}
// }
