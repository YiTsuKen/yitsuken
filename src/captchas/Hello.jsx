export default function Hello({ onComplete }) {
  return (
    <div>
      <h2 className="">Click the red dot!</h2>
      <button onClick={onComplete}>🔴</button>
    </div>
  );
}