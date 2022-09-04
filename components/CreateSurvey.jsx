import { useMutation } from "@apollo/client";
import React from "react";
import { CREATE_SURVEY } from "../mutations";

import { useFormChange } from "hooks";
import { GET_SURVEYS } from "queries";

const CreateSurvey = ({ closeForm }) => {
  const [createSurvey] = useMutation(CREATE_SURVEY, {
    onCompleted: closeForm,
    refetchQueries: [GET_SURVEYS],
  });

  const [createFormValues, onCreateFormChange] = useFormChange({
    title: "",
  });

  const createSurveyInForm = (e) => {
    e.preventDefault();
    createSurvey({ variables: createFormValues });
    return false;
  };

  return (
    <form onSubmit={createSurveyInForm}>
      <input
        value={createFormValues.title}
        name="title"
        type="text"
        onChange={onCreateFormChange}
      />

      <button type="submit">Create</button>
      <button onClick={closeForm} type="button">
        Cancel
      </button>
    </form>
  );
};

export default CreateSurvey;
