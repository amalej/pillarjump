import { firestoreDb } from "@/firebase";
import {
  addDoc,
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import User from "./user";

export interface UserScore {
  uid: string;
  name: string;
  score: number;
  sid: string;
}

const MAX_LOCAL_HIGHSCORE_COUNT = 15;
export const MAX_GLOBAL_HIGHSCORE_COUNT = 3;
export const MAX_DATABASE_TOP_SCORE_COUNT = 10;
export const MAX_DATABASE_HIGHER_SCORE_COUNT = 5;

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
          .slice(0, MAX_LOCAL_HIGHSCORE_COUNT);
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
        if (scores.length < MAX_LOCAL_HIGHSCORE_COUNT) return true;
        if (scores[scores.length - 1].score < score) return true;
        else return false;
      }
      return true;
    },
    reset: () => {
      window.localStorage.removeItem("scores");
    },
  };

  static database = {
    getClosestHigherScores: async (userScore: UserScore) => {
      const collectionRef = collection(firestoreDb, "scores");
      const higherScoresQuery = query(
        collectionRef,
        where("score", ">", userScore.score),
        orderBy("score", "asc"),
        limit(MAX_DATABASE_HIGHER_SCORE_COUNT)
      );

      const higherScoresSnapshot = await getDocs(higherScoresQuery);
      let scores: UserScore[] = [];
      for (let score of higherScoresSnapshot.docs) {
        const userScore = score.data() as UserScore;
        scores.push(userScore);
      }

      if (scores.length > 0) scores = scores.sort((a, b) => b.score - a.score);
      return scores;
    },
    getTopScores: async (): Promise<UserScore[]> => {
      const collectionRef = collection(firestoreDb, "scores");
      const highestScoreQuery = query(
        collectionRef,
        orderBy("score", "desc"),
        limit(MAX_DATABASE_TOP_SCORE_COUNT)
      );

      const highestScoreSnapshot = await getDocs(highestScoreQuery);
      const scores: UserScore[] = [];
      for (let score of highestScoreSnapshot.docs) {
        const userScore = score.data() as UserScore;
        scores.push(userScore);
      }

      return scores;
    },
    syncTopLocalScores: async () => {
      const highestScoreLocal: UserScore[] = Score.localStorage
        .get()
        .slice(0, MAX_GLOBAL_HIGHSCORE_COUNT);
      const collectionRef = collection(firestoreDb, "scores");
      const localScoreSid = highestScoreLocal.map((val) => val.sid);
      const userScoreQuery = query(
        collectionRef,
        where("uid", "==", User.localStorage.getId())
      );
      const userScoreSnapshot = await getDocs(userScoreQuery);
      const dbScores = userScoreSnapshot.docs.reduce(function (map: any, obj) {
        const _docData = obj.data() as UserScore;
        map[_docData.sid] = { ..._docData, docRef: obj.ref };
        return map;
      }, {});

      const dbScoresReferences = { ...dbScores };
      [...localScoreSid].forEach((e) => delete dbScoresReferences[e]);

      const batch = writeBatch(firestoreDb);
      let dbScoreRefCounter = 0;
      for (let localScore of highestScoreLocal) {
        if (dbScores[localScore.sid] === undefined) {
          if (dbScoreRefCounter < Object.keys(dbScoresReferences).length) {
            const key = Object.keys(dbScoresReferences)[dbScoreRefCounter];
            const docRef = dbScores[key].docRef;
            dbScoreRefCounter++;
            batch.set(docRef, localScore);
          } else {
            const docRef = doc(collection(firestoreDb, "scores"));
            batch.set(docRef, localScore);
          }
        }
      }

      await batch.commit();
    },
    getGlobalPosition: async (userScore: UserScore): Promise<number | null> => {
      const collectionRef = collection(firestoreDb, "scores");
      const countQuery = query(
        collectionRef,
        where("score", ">", userScore.score)
      );
      const countSnapshot = await getCountFromServer(countQuery);
      return countSnapshot.data().count + 1; // This starts at 1
    },
    get: async (userId: string): Promise<UserScore | null> => {
      const docRef = doc(firestoreDb, "scores", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as UserScore;
      } else {
        return null;
      }
    },
    add: async (userScore: UserScore) => {
      const collectionRef = collection(firestoreDb, "scores");
      const countQuery = query(
        collectionRef,
        where("uid", "==", userScore.uid)
      );
      const countSnapshot = await getCountFromServer(countQuery);
      if (countSnapshot.data().count < MAX_GLOBAL_HIGHSCORE_COUNT) {
        await addDoc(collectionRef, userScore);
      } else {
        const lowestScoreQuery = query(
          collectionRef,
          where("uid", "==", userScore.uid),
          orderBy("score", "desc"),
          limit(1)
        );
        const lowestScoreSnapshot = await getDocs(lowestScoreQuery);
        const lowestScoreDoc = lowestScoreSnapshot.docs[0];
        await setDoc(lowestScoreDoc.ref, userScore);
      }
    },
  };
}
