import { PieChart, Pie } from "recharts";

function Grafico() {
  return (
    <PieChart width={200} height={200}>
      <Pie data={[{ value: 10 }, { value: 20 }]} dataKey="value" />
    </PieChart>
  );
}

export default Grafico;