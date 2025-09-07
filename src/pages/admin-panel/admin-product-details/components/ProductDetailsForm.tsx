import { colorOptions } from "@/components/product/product-form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

export const ProductDetailsForm = () => {
  const { register, watch, setValue } = useFormContext();
  const selectedColor = watch("labelColor");

  return (
    <form>
      {/* Hidden input to rigers labelColor form state */}
      <input type="hidden" {...register("labelColor")} />

      <div>
        <label className="block text-sm font-medium mb-1">Nazwa:</label>
        <Input {...register("name")} placeholder="Wpisz nazwę produktu" className="h-10" />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">Kolor etykiety:</label>
        <div className="flex space-x-2">
          {colorOptions.map((color) => (
            <span
              key={color}
              onClick={() => setValue("labelColor", color, { shouldDirty: true })}
              className={`w-8 h-8 rounded-full cursor-pointer transition
                ${
                  selectedColor === color ? "border-black ring-2 ring-offset-2 ring-black" : "border-gray-300"
                } hover:scale-110`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </form>
  );
};
