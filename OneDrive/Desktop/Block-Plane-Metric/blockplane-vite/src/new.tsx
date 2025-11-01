import InsightBox from './components/InsightBox';

const dummyData = [
  { name: 'Concrete', value: 90 },
  { name: 'Hempcrete', value: 40 },
  { name: 'Foam Board', value: 70 }
];

function App() {
  return (
    <div>
      <h1>BlockPlane Test</h1>
      <InsightBox data={dummyData} barColor="#3cb371" />
    </div>
  );
}

export default App;
