export default function Hello({ onComplete }) {
  return (
    <div>
      <h2>Click the red dot!</h2>
      <button onClick={onComplete}>🔴</button>
    </div>
  );
}