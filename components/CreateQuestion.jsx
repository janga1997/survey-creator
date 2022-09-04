import { useMutation } from "@apollo/client";
import React from "react";
import { CREATE_QUESTION } from "../mutations";

import { useFormChange } from "hooks";
import { GET_QUESTIONS } from "queries";
import { useRouter } from "next/router";

const OptionsInput = ({ answerType, options, setFormValues }) => {
  const onOptionsChange = (event) => {
    const {
      target: { value },
    } = event;
    if (answerType === "TEXT")
      setFormValues((values) => ({
        ...values,
        options: { placeholderText: value },
      }));
  };

  return (
    <fieldset>
      <legend>Options For the Question</legend>
      {answerType === "TEXT" && (
        <input
          value={options?.placeholderText}
          type="text"
          onChange={onOptionsChange}
        />
      )}
    </fieldset>
  );
};

const CreateQuestion = ({ closeForm }) => {
  const {
    query: { surveyId },
  } = useRouter();

  const [createSurvey] = useMutation(CREATE_QUESTION, {
    onCompleted: closeForm,
    refetchQueries: [{ query: GET_QUESTIONS, variables: { surveyId } }],
  });

  const [createFormValues, onCreateFormChange, setFormValues] = useFormChange({
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
      <fieldset>
        <legend>Required Inputs</legend>
        <label>
          Question Text:
          <input
            value={createFormValues.text}
            name="text"
            type="text"
            required
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
      </fieldset>
      <OptionsInput
        setFormValues={setFormValues}
        answerType={createFormValues.answerType}
      />

      <button type="submit">Create</button>
      <button onClick={closeForm} type="button">
        Cancel
      </button>
    </form>
  );
};

export default CreateQuestion;
