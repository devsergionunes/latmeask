import './questions.css';
export function Questions({
  children,
  content,
  author,
  isAnswered = false,
  isHighlighted = false,
}) {
  return (
    <div
      className={`question ${isAnswered ? 'answerd' : ''} ${
        isHighlighted && !isAnswered ? 'highlight' : ''
      }`}
    >
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt="avatar do usuario" />
          <span>{author.name}</span>
        </div>
        <div className="user-buttons">{children}</div>
      </footer>
    </div>
  );
}
