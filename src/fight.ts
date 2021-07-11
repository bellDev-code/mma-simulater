import { SKILL_LIST } from './constants/skill';
import { PlayerInstance } from './player';
import { makeRandom } from './resources/utils';
import { Player } from './types/player';

const FIGHT_PLAYER_LIMIT = 2;
const ATTACK_TERM = 10;

type SkillTextProps = {
  attackPlayer: Player;
  defensePlayer: Player;
  damage: number;
};

// displaySkillText('a', 'b')
// object 형태로 넣으면 인수 순서가 상관이 없음 즉, 앞으로 늘어날 인수 순서
// 신경 안써도 된다.
// displaySkillText({
//   damage: 100,
//   a: a,
//   b, b
// })

const displaySkillText = ({ damage, attackPlayer, defensePlayer }: SkillTextProps) => {
  // const {a, b, c} = props
  const skill = SKILL_LIST[makeRandom(SKILL_LIST.length - 1)];

  return console.log(
    `${attackPlayer.name}의 ${skill} ${defensePlayer.name}에게 적중합니다! (damage: -${damage}, hp: ${defensePlayer.stats.hp})`,
  );
};

export class Fight {
  constructor(public players: PlayerInstance[]) {
    if (players.length > FIGHT_PLAYER_LIMIT) {
      throw new Error(`player max limit is ${FIGHT_PLAYER_LIMIT}`);
    }
  }

  private calDamage(player: Player) {
    return player.stats.attack + player.stats.defence;
  }

  private applyDamage(defensePlayer: PlayerInstance, damage: number) {
    defensePlayer.player.stats.hp -= damage;
  }

  private turn(attackPlayer: PlayerInstance, defensePlayer: PlayerInstance) {
    const damage = this.calDamage(attackPlayer.player);
    this.applyDamage(defensePlayer, damage);
    displaySkillText({
      attackPlayer: attackPlayer.player,
      defensePlayer: defensePlayer.player,
      damage: damage,
    });
  }

  private winner(red: PlayerInstance, blue: PlayerInstance) {
    if (red.player.stats.hp <= 0) {
      return blue;
    }
    return red;
  }

  async play() {
    // 배열의 0 index에 해당하는 element를 바로 변수명 선언하는 방법
    // 불변성 문제 발생!
    // shallow는 객체가 아닌 것들은 불변성 유지하고 새로운 메모리 할당되는데
    // 객체는 기존에 있던 메모리로 할당된다. 즉, 객체 property들의 불변성 유지 x
    // deep copy
    const [red, blue] = JSON.parse(JSON.stringify(this.players));

    while (red.player.stats.hp > 0 && blue.player.stats.hp > 0) {
      switch (makeRandom(1)) {
        case 0:
          this.turn(red, blue);
          break;
        case 1:
          this.turn(blue, red);
          break;
        default:
          throw new Error();
      }
      await new Promise((f) => setTimeout(f, makeRandom(ATTACK_TERM)));
    }

    const winnerInstance = this.winner(red, blue);

    const winner = this.players.find((player) => player.player.id === winnerInstance.player.id);

    const loser = this.players.find((player) => player.player.id !== winnerInstance.player.id);

    if (!winner || !loser) {
      throw new Error(`critical error (cannot find winner)`);
    }

    winner.win();
    loser.lose();
    console.log(`승자는 ${winner.player.name}입니다!!!`);

    return {
      winner: winner,
      loser: loser,
    };
  }
}
