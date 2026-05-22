import { X } from "lucide-react";
import { useAppContext } from "../../../context/hooks/useAppContext";

interface HeaderCoinModal {
  handleClose: () => void;
}

export const HeaderCoinModal = ({ handleClose }: HeaderCoinModal) => {
  const { selectedCoinId } = useAppContext();
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-4">
      <div>
        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">
          Coin Analytics
        </span>
        <h2 className="text-xl font-bold text-white mt-1 capitalize">
          {selectedCoinId || "Loading..."}
        </h2>
      </div>

      <button
        onClick={handleClose}
        className="p-1.5 rounded-lg bg-white/5 cursor-pointer text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
      >
        <X size={25} />
      </button>
    </div>
  );
};
