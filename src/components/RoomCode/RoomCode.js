import './roomCode.css';
import copyImg from '../../assests/images/copy.svg';

export function RoomCode({ code }) {
  function copyRoomCodeToClipBoard() {
    navigator.clipboard.writeText(code);
  }
  return (
    <button className="room-code" onClick={copyRoomCodeToClipBoard}>
      <div>
        <img src={copyImg} alt="copiar codigo da sala" />
      </div>
      <span>sala #{code}</span>
    </button>
  );
}
