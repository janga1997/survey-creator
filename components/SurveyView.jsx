import React from "react";

import { useMutation } from "@apollo/client";
import { DELETE_SURVEY, UPDATE_SURVEY } from "mutations";
import { GET_SURVEYS } from "queries";

import { useToggle, useFormChange } from "hooks";
import Link from "next/link";

const SurveyRead = ({ index, id, title, toggle, order }) => {
  const [deleteSurvey] = useMutation(DELETE_SURVEY, {
    update: (cache, { data: { removeSurvey } }) =>
      cache.updateQuery({ query: GET_SURVEYS }, (data) => ({
        allSurveys: data?.allSurveys.filter(
          ({ id }) => id !== removeSurvey?.id
        ),
      })),
  });

  const deleteFromButton = () => {
    deleteSurvey({ variables: { id } });
  };

  return (
    <div>
      <h2>{index}</h2>
      <h2>
        <Link href={`/survey/${id}`}>{title}</Link>
      </h2>
      <h3>{`${order?.length || 0} questions in this survey`}</h3>

      <div>
        <button onClick={toggle}>Edit</button>
        <button onClick={deleteFromButton}>Delete</button>
      </div>
    </div>
  );
};

const SurveyEdit = ({ index, id, title, toggle }) => {
  const [updateSurvey] = useMutation(UPDATE_SURVEY, {
    onCompleted: toggle,
  });

  const [updateFormValues, onUpdateFormChange] = useFormChange({
    id,
    title,
  });

  const updateSurveyInForm = (e) => {
    e.preventDefault();
    updateSurvey({ variables: updateFormValues });
    return false;
  };

  return (
    <form onSubmit={updateSurveyInForm}>
      <h2>{index}</h2>
      <input
        value={updateFormValues.title}
        name="title"
        type="text"
        onChange={onUpdateFormChange}
      />

      <button type="submit">Update</button>
      <button onClick={toggle} type="button">
        Cancel
      </button>
    </form>
  );
};

const SurveyView = (survey) => {
  const [readView, readToggle] = useToggle(true);

  return readView ? (
    <SurveyRead {...survey} toggle={readToggle} />
  ) : (
    <SurveyEdit {...survey} toggle={readToggle} />
  );
};

export default SurveyView;
