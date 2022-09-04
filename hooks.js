import { useState } from "react";

export const useFormChange = (initialState) => {
  const [formState, setFormState] = useState(initialState);

  const onInputChange = (event) => {
    const { target } = event;
    const { type, name } = target;

    const value = type === "checkbox" ? target.checked : target.value;

    console.log(name, value);

    setFormState({ ...formState, [name]: value });
  };

  return [formState, onInputChange];
};

export const useToggle = (initialValue = false) => {
  const [boolValue, setBool] = useState(initialValue);

  const toggleValue = () => setBool(!boolValue);

  return [boolValue, toggleValue];
};
