import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import bgImg from '../assests/images/illustration.svg';
import logoImg from '../assests/images/logo.svg';
import '../styles/auth.css';
import { Button } from '../components/button/Button';
export function NewRoom() {
  const { user } = useAuth();
  const history = useHistory();

  const [newRoom, setNewRoom] = React.useState('');

  async function hendalCreateRoom(event) {
    event.preventDefault();
    if (newRoom.trim() === '') {
      return;
    }
    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user.id,
    });
    history.push(`/admin/rooms/${firebaseRoom.key}`);
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
          <h2>Criar uma nova sala</h2>
          <form onSubmit={hendalCreateRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              onChange={({ target }) => setNewRoom(target.value)}
              value={newRoom}
            />
            <Button type="text">Criar sala</Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
