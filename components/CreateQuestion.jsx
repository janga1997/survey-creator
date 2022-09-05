import { useMutation } from "@apollo/client";
import React from "react";
import { CREATE_QUESTION } from "../mutations";

import { useFormChange } from "hooks";
import { GET_QUESTIONS } from "queries";
import { useRouter } from "next/router";

export const OptionsInput = ({ answerType, options, setFormValues }) => {
  const removeOption = (index) => () => {
    setFormValues((values) => ({
      ...values,
      options: options.filter((_, i) => i !== index),
    }));
  };

  const addOption = () => {
    setFormValues((values) => ({
      ...values,
      options: [...options, ""],
    }));
  };

  const onArrayChange = (index) => (e) => {
    const {
      target: { value },
    } = e;
    const newOptions = options.slice();
    newOptions[index] = value;
    setFormValues((values) => ({
      ...values,
      options: newOptions,
    }));
  };

  return (
    answerType.includes("SELECT") && (
      <fieldset>
        <legend>Options For the Question</legend>
        <>
          {options.map((value, index) => (
            <div key={index}>
              <input value={value} required onChange={onArrayChange(index)} />
              <button onClick={removeOption(index)}>Delete</button>
            </div>
          ))}
        </>
        <button onClick={addOption}>Add</button>
      </fieldset>
    )
  );
};

const CreateQuestion = ({ closeForm }) => {
  const {
    query: { surveyId },
  } = useRouter();

  const [createSurvey] = useMutation(CREATE_QUESTION, {
    onCompleted: (data) => {
      const id = data?.createQuestion?.id;
      closeForm(id);
    },
    update: (cache, { data: { createQuestion } }) =>
      cache.updateQuery(
        { query: GET_QUESTIONS, variables: { surveyId } },
        (data) => ({
          Survey: {
            ...data?.Survey,
            Questions: [...(data?.Survey?.Questions || []), createQuestion],
          },
        })
      ),
  });

  const [createFormValues, onCreateFormChange, setFormValues] = useFormChange({
    text: "",
    required: false,
    answerType: "TEXT",
    options: [],
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
        options={createFormValues.options}
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
