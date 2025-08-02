import React from "react";

interface PproductTabCardProps {
  name: string;
  isActive: boolean;
  onClick: () => void;
}

const ProductTabCard = ({ name, isActive, onClick }: PproductTabCardProps) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center whitespace-nowrap px-3 py-3 text-sm font-medium transition-all
                focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50
                ${
                  isActive
                    ? "text-primary border-b-1 border-primary"
                    : "hover:text-foreground text-muted-foreground"
                }`}
    >
      {name}
    </button>
  );
};

export default ProductTabCard;
