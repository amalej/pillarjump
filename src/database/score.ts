export interface UserScore {
  uid: string;
  name: string;
  score: number;
  sid: string;
}

const MAX_HIGHSCORE_COUNT = 10;

export default class Score {
  static localStorage = {
    get: (): UserScore[] => {
      const localStorageScore = window.localStorage.getItem("scores");
      if (localStorageScore) {
        let scores = JSON.parse(localStorageScore) as UserScore[];
        scores = scores.sort((a, b) => b.score - a.score);
        return scores;
      }
      return [];
    },
    add: (userScore: UserScore) => {
      const localStorageScore = window.localStorage.getItem("scores");
      if (localStorageScore) {
        let scores = JSON.parse(localStorageScore) as UserScore[];
        scores.push(userScore);
        scores = scores
          .sort((a, b) => b.score - a.score)
          .slice(0, MAX_HIGHSCORE_COUNT);
        window.localStorage.setItem("scores", JSON.stringify(scores));
      } else {
        window.localStorage.setItem("scores", JSON.stringify([userScore]));
      }
    },
    isHighScore: (score: number) => {
      if (score === 0) return false;
      const localStorageScore = window.localStorage.getItem("scores");
      if (localStorageScore) {
        let scores = JSON.parse(localStorageScore) as UserScore[];
        scores = scores.sort((a, b) => b.score - a.score);
        if (scores.length < MAX_HIGHSCORE_COUNT) return true;
        if (scores[scores.length - 1].score < score) return true;
        else return false;
      }
      return true;
    },
    reset: () => {
      window.localStorage.removeItem("scores");
    },
  };
}
