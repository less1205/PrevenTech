import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const COLORS = [
  "#e84118",
  "#fbc531",
  "#4cd137"
];

function Grafico({ datos }) {

  return (

    <ResponsiveContainer width="100%" height={300}>

      <PieChart>

        <Pie
          data={datos}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={90}
          innerRadius={50}
          paddingAngle={4}
        >

          {datos.map((entry, index) => (

            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />

          ))}

        </Pie>

        <Tooltip />

      </PieChart>

    </ResponsiveContainer>
  );
}

export default Grafico;