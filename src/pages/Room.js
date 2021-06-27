import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import { Button } from '../components/button/Button';
import { RoomCode } from '../components/RoomCode/RoomCode';
import logoImg from '../assests/images/logo.svg';
import { Questions } from '../components/Questions/Questions';
import { useRoom } from '../hooks/useRoom';
import '../styles/room.css';

export function Room() {
  const { user } = useAuth();
  const [newQuestion, setNewQuestion] = React.useState('');
  const params = useParams();
  const roomId = params.id;
  const history = useHistory();
  const { questions, title } = useRoom(roomId);

  async function hendleSendQuestion(event) {
    event.preventDefault();
    if (newQuestion.trim() === '') return;
    if (!user) throw new Error('Você deve estar logado para enviar perguntas');
    const endeAt = await (await database.ref(`rooms/${roomId}`).get()).val();
    if (endeAt.endeAt) {
      window.alert('Sala encerrada');
      history.push('/');
      return;
    }
    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };
    await database.ref(`rooms/${roomId}/questions`).push(question);
    setNewQuestion('');
  }
  async function handleLikeQuestion(questionId, likeId) {
    if (likeId) {
      await database
        .ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`)
        .remove();
    } else {
      await database
        .ref(`rooms/${roomId}/questions/${questionId}/likes`)
        .push({ authorId: user.id });
    }
  }
  return (
    <div id="page-room">
      <header>
        <div>
          <img src={logoImg} alt="latmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>
      <main className="content">
        <div className="room-title">
          <h1>{title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>
        <form onSubmit={hendleSendQuestion}>
          <textarea
            placeholder="O que vc quer perguntar ?"
            onChange={({ target }) => setNewQuestion(target.value)}
            value={newQuestion}
          />
          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt="avatar do ususario" />
                {user.name}
              </div>
            ) : (
              <div>
                Para enviar uma pergunta, <span>faça seu login</span>
              </div>
            )}
            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>
        <div className="questions-list">
          {questions.map((question) => {
            return (
              <Questions
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <button
                    className={`like-button ${question.likeId ? 'liked' : ''}`}
                    type="button"
                    aria-label="marcar como gostei"
                    onClick={() =>
                      handleLikeQuestion(question.id, question.likeId)
                    }
                  >
                    {question.likeCount > 0 && (
                      <span>{question.likeCount}</span>
                    )}
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
                        stroke="#737380"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </Questions>
            );
          })}
        </div>
      </main>
    </div>
  );
}
