import { useState } from "react";

export const useFormChange = (initialState) => {
  const [formState, setFormState] = useState(initialState);

  const onInputChange = (event) => {
    const { target } = event;
    const { type, name } = target;

    const value = type === "checkbox" ? target.checked : target.value;

    let resetOptions = {};
    if (name === "answerType" && !value.includes("SELECT")) {
      resetOptions = { options: [] };
    }

    setFormState({ ...formState, [name]: value, ...resetOptions });
  };

  return [formState, onInputChange, setFormState];
};

export const useToggle = (initialValue = false) => {
  const [boolValue, setBool] = useState(initialValue);

  const toggleValue = () => setBool(!boolValue);

  return [boolValue, toggleValue];
};
