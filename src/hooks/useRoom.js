import React from 'react';
import { database } from '../services/firebase';
import { useAuth } from './useAuth';

export function useRoom(roomid) {
  let [questions, setQuestions] = React.useState([]);
  const [title, setTitle] = React.useState('');
  const { user } = useAuth();
  React.useEffect(() => {
    const roomRef = database.ref(`rooms/${roomid}`);
    roomRef.on('value', (room) => {
      const databaseQuestions = room.val();
      const parsedQuestions = Object.entries(
        databaseQuestions.questions ?? {},
      ).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(
            ([key, like]) => like.authorId === user?.id,
          )?.[0],
        };
      });
      setTitle(databaseQuestions.title);
      setQuestions(parsedQuestions);
    });
    return () => {
      roomRef.off('value');
    };
  }, [roomid, user]);
  return { questions, title };
}
