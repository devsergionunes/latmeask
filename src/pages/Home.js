import React from 'react';
import { useHistory } from 'react-router-dom';
import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import bgImg from '../assests/images/illustration.svg';
import logoImg from '../assests/images/logo.svg';
import googleIcon from '../assests/images/google-icon.svg';
import '../styles/auth.css';
import { Button } from '../components/button/Button';
export function Home() {
  const { user, signInWithGoogle } = useAuth();
  const history = useHistory();
  const [roomCode, setRoomCode] = React.useState('');
  async function hendleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }
    history.push('/rooms/new');
  }
  async function hendalJoinRoom(event) {
    event.preventDefault();
    if (roomCode.trim() === '') return;

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      window.alert('Sala nao existe');
      return;
    }
    if (roomRef.val().endeAt) {
      alert('sala encerrada.');
      return;
    }

    history.push(`rooms/${roomCode}`);
  }
  return (
    <div id="page-auth">
      <aside>
        <img src={bgImg} alt="" />
        <strong>Crie salas de Q&amp;A ao vivo</strong>
        <p>Tires as duvidas da sua audiencia em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="letmeask" />
          <button className="create-room" onClick={hendleCreateRoom}>
            <img src={googleIcon} alt="logo do google" />
            Crie sua sala com o google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={hendalJoinRoom}>
            <input
              type="text"
              placeholder="Digite o codigo da sala"
              onChange={({ target }) => setRoomCode(target.value)}
              value={roomCode}
            />
            <Button type="text">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
