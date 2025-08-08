interface InputSliderProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  displayValue?: string;
  description?: React.ReactNode;
}

const InputSlider: React.FC<InputSliderProps> = ({
  label,
  min,
  max,
  step,
  value,
  onChange,
  unit = "",
  displayValue,
  description,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  return (
    <div className="mb-4 p-4 rounded-lg border ">
      <label htmlFor={label} className="block text-sm font-medium mb-2">
        {label}
      </label>
      <div className="flex items-center space-x-3">
        <input
          id={label}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="w-full h-2 bg-primary/10 rounded-lg appearance-none cursor-pointer range-lg accent-sky-500"
        />
        <span className="text-lg font-semibold w-24 text-right">
          {displayValue ||
            value.toFixed(unit === "%" || unit === "บาท" ? 2 : 0)}{" "}
          {unit}
        </span>
      </div>
      {description && <p className="text-xs mt-2">{description}</p>}
    </div>
  );
};

export default InputSlider;
