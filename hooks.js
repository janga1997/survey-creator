import { useMutation } from "@apollo/client";
import { UPDATE_ORDER } from "mutations";
import { GET_QUESTIONS } from "queries";
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

export const useUpdateOrder = (id) => {
  const [updateSurvey] = useMutation(UPDATE_ORDER, {
    refetchQueries: [{ query: GET_QUESTIONS, variables: { surveyId: id } }],
  });

  const updateOrder = (order) => updateSurvey({ variables: { id, order } });

  return [updateOrder];
};
