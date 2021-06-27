import React from 'react';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import { Button } from '../components/button/Button';
import { RoomCode } from '../components/RoomCode/RoomCode';
import logoImg from '../assests/images/logo.svg';
import deleteImg from '../assests/images/delete.svg';
import checkImg from '../assests/images/check.svg';
import answerImg from '../assests/images/answer.svg';
import { Questions } from '../components/Questions/Questions';
import { useRoom } from '../hooks/useRoom';
import '../styles/room.css';

export function AdminRoom() {
  const history = useHistory();
  const { user } = useAuth();
  const params = useParams();
  const roomId = params.id;
  const { questions, title } = useRoom(roomId);

  async function handleDeleteQuestion(questionId) {
    if (window.confirm('Voce tem certeza qe deseja excluir essa pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }
  async function handleEndRoom() {
    const roomRef = await database.ref(`rooms/${roomId}/${user.id}`).key;
    if (roomRef) {
      await database.ref(`rooms/${roomId}`).update({ endeAt: new Date() });
      history.push('/');
    }
  }
  async function handleCheckQuestionAnswer(questionId) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }
  async function handleHighlightQuestion(questionId) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }
  return (
    <div id="page-room">
      <header>
        <div>
          <img src={logoImg} alt="latmeask" />
          <div className="header-buttons">
            <RoomCode code={roomId} />
            <Button outlined onClick={handleEndRoom}>
              Emcerrar sala
            </Button>
          </div>
        </div>
      </header>
      <main className="content">
        <div className="room-title">
          <h1>{title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>
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
                  <>
                    <button
                      type="button"
                      aria-label="botao de marcar pergunta como respondida"
                      onClick={() => handleCheckQuestionAnswer(question.id)}
                    >
                      <img
                        src={checkImg}
                        alt="icone marca pergunta como respondida "
                      />
                    </button>
                    <button
                      type="button"
                      aria-label="botao de dar destaque a pergunta"
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <img
                        src={answerImg}
                        alt="icone de dar destaque a pergunta"
                      />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  aria-label="botao de excluir pergunta"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="icone excluir pergunta" />
                </button>
              </Questions>
            );
          })}
        </div>
      </main>
    </div>
  );
}
