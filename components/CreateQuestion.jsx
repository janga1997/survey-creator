import { useMutation } from "@apollo/client";
import React from "react";
import { CREATE_QUESTION } from "../mutations";

import { useFormChange } from "hooks";
import { GET_QUESTIONS } from "queries";
import { useRouter } from "next/router";

const CreateQuestion = ({ closeForm }) => {
  const {
    query: { surveyId },
  } = useRouter();

  const [createSurvey] = useMutation(CREATE_QUESTION, {
    onCompleted: closeForm,
    refetchQueries: [{ query: GET_QUESTIONS, variables: { surveyId } }],
  });

  const [createFormValues, onCreateFormChange] = useFormChange({
    text: "",
    required: false,
    answerType: "TEXT",
    options: {},
  });

  const createSurveyInForm = (e) => {
    e.preventDefault();
    createSurvey({ variables: { ...createFormValues, surveyId } });
    return false;
  };

  return (
    <form onSubmit={createSurveyInForm}>
      <label>
        Question Text:
        <input
          value={createFormValues.text}
          name="text"
          type="text"
          onChange={onCreateFormChange}
        />
      </label>
      <label>
        Answer Type:
        <select
          value={createFormValues.answerType}
          onChange={onCreateFormChange}
          name="answerType"
        >
          <option value="TEXT">Text</option>
          <option value="BOOLEAN">Boolean</option>
          <option value="NUMBER">Number</option>
          <option value="SELECT">Single Choice</option>
          <option value="MULTISELECT">Multiple Choice</option>
        </select>
      </label>
      <label>
        Required:
        <input
          checked={createFormValues.required}
          name="required"
          type="checkbox"
          onChange={onCreateFormChange}
        />
      </label>

      <button type="submit">Create</button>
      <button onClick={closeForm} type="button">
        Cancel
      </button>
    </form>
  );
};

export default CreateQuestion;
