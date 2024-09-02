type FormInputProps = {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function FormInput({
  label,
  name,
  placeholder,
  onChange,
  value,
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="font-medium text-black/50">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        placeholder={placeholder}
        className="input"
        onChange={onChange}
        required
      />
    </div>
  );
}
