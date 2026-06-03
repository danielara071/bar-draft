import { useState } from "react";
import Productos from "../features/tienda/components/Productos";
import Rifas from "../features/tienda/components/Rifas";

const Tienda = () => {
  const [activeTab, setActiveTab] = useState<Tab>("productos");

  return (
    <div>
      <Productos />
      <Rifas />
    </div>
  );
};

export default Tienda;
