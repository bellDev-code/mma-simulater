import { Fight } from './fight';
import { PlayerInstance } from './player';
import { Stage } from './stage';
import { Weight } from './types/weight';

type RaffleMethod = 'pov' | 'winCount' | 'loseCount';

interface ILeague {
  weightClass: Weight;
  stage?: Stage;
  joinPlayers: (players: PlayerInstance | PlayerInstance[]) => void;
}

// implements 구현하다! 팀원과의 협력과 재사용성에 좋다.
// class가 해당 interface를 필수적으로 구현하게끔 한다.
export class League implements ILeague {
  stage?: Stage;
  start(raffleMethod: RaffleMethod) {
    // 배열 ... 하는 이유 : 메모리 참조로 새로운 배열을 만들어서 기존의 값을 건드리지 않고
    // 새로운 객체를 만들기 위해서.
    const players = [...this.playerInstances];
    const fights = this.raffleFight(players, raffleMethod);
    this.stage = new Stage(fights);
    this.stage.start();
  }

  raffleFight(players: PlayerInstance[], raffleMethod: RaffleMethod) {
    let sotedPlayers: PlayerInstance[] = [];
    switch (raffleMethod) {
      case 'pov':
        sotedPlayers = players.sort((a, b) => a.player.grade.pov - b.player.grade.pov);
        break;
      case 'winCount':
        sotedPlayers = players.sort((a, b) => b.player.grade.total.win - a.player.grade.total.win);
        break;
      case 'loseCount':
        sotedPlayers = players.sort(
          (a, b) => b.player.grade.total.lose - a.player.grade.total.lose,
        );
        break;
      default:
        throw new Error(`${raffleMethod} is not raffle method 😂`);
    }
    const fights = this.createFights(sotedPlayers);

    this.printFightRaffle(fights);
    return fights;
  }

  createFights(players: PlayerInstance[]) {
    const isUnearneWin = players.length % 2;
    const fights: Fight[] = [];

    for (let i = 0; i < players.length; i += 2) {
      fights.push(new Fight([players[i], players[i + 1]]));
    }
    /**
     * @TODO 플레이어 홀수 참여 시 부전승 추가
     */

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

  playerInstances: PlayerInstance[] = [];
  constructor(private matchLength: number, public weightClass: Weight) {}
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
