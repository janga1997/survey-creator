import React from "react";

import { GET_QUESTIONS } from "queries";
import { DELETE_QUESTION, UPDATE_QUESTION } from "mutations";

import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

import { useToggle, useFormChange, useUpdateOrder } from "hooks";
import { OptionsInput } from "./CreateQuestion";

const QuestionRead = ({
  index,
  id,
  text,
  toggle,
  required,
  answerType,
  options,
}) => {
  const {
    query: { surveyId },
  } = useRouter();

  const { data } = useQuery(GET_QUESTIONS, {
    skip: !Boolean(surveyId),
    variables: { surveyId },
  });
  const order = data?.Survey?.order || [];

  const [updateOrder] = useUpdateOrder(surveyId);

  const [deleteQuestion] = useMutation(DELETE_QUESTION, {
    onCompleted: (deletedData) => {
      const deletedId = deletedData?.removeQuestion?.id;
      const orderSet = new Set(order);
      orderSet.delete(deletedId);
      updateOrder([...orderSet]);
    },
  });

  const deleteFromButton = () => {
    deleteQuestion({ variables: { id } });
  };

  return (
    <div>
      <h2>{index}</h2>
      <h2>{text}</h2>
      <span
        style={{ paddingRight: "2rem" }}
      >{`Answer Type: ${answerType}`}</span>
      <span>{`Required: ${Boolean(required)}`}</span>

      {answerType.includes("SELECT") && (
        <ul>
          {options.map((value) => (
            <li key={value}>{value}</li>
          ))}
        </ul>
      )}

      <div>
        <button onClick={toggle}>Edit</button>
        <button onClick={deleteFromButton}>Delete</button>
      </div>
    </div>
  );
};

const QuestionEdit = ({
  index,
  id,
  text,
  toggle,
  required,
  answerType,
  options,
}) => {
  const {
    query: { surveyId },
  } = useRouter();

  const [updateQuestion] = useMutation(UPDATE_QUESTION, {
    onCompleted: toggle,
    refetchQueries: [{ query: GET_QUESTIONS, variables: { surveyId } }],
  });

  const [updateFormValues, onUpdateFormChange, setFormValues] = useFormChange({
    id,
    text,
    required,
    answerType,
    options: options || [],
  });

  const updateSurveyInForm = (e) => {
    e.preventDefault();
    updateQuestion({ variables: { ...updateFormValues, surveyId } });
    return false;
  };
  return (
    <form onSubmit={updateSurveyInForm}>
      <h2>{index}</h2>
      <input
        value={updateFormValues.text}
        name="text"
        type="text"
        onChange={onUpdateFormChange}
      />
      <select
        value={updateFormValues.answerType}
        onChange={onUpdateFormChange}
        name="answerType"
      >
        <option value="TEXT">Text</option>
        <option value="BOOLEAN">Boolean</option>
        <option value="NUMBER">Number</option>
        <option value="SELECT">Single Choice</option>
        <option value="MULTISELECT">Multiple Choice</option>
      </select>
      <input
        checked={updateFormValues.required}
        name="required"
        type="checkbox"
        onChange={onUpdateFormChange}
      />

      <OptionsInput
        options={updateFormValues.options}
        setFormValues={setFormValues}
        answerType={updateFormValues.answerType}
      />
      <button type="submit">Update</button>
      <button onClick={toggle} type="button">
        Cancel
      </button>
    </form>
  );
};

const QuestionView = (question) => {
  const [readView, readToggle] = useToggle(true);

  return readView ? (
    <QuestionRead {...question} toggle={readToggle} />
  ) : (
    <QuestionEdit {...question} toggle={readToggle} />
  );
};

export default QuestionView;
