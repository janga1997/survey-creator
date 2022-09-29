import { useMutation } from "@apollo/client";
import React from "react";
import { CREATE_QUESTION } from "../mutations";

import { useFormChange } from "hooks";
import { GET_QUESTIONS } from "queries";
import { useRouter } from "next/router";
import {
  Button,
  Switch,
  Input,
  Heading,
  Select,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

const OptionsInput = ({ answerType, options, setFormValues }) => {
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
      <VStack as="fieldset" border="2px" borderRadius="10px" padding="1rem">
        <HStack justifyContent="space-between" width="100%">
          <Heading as="legend" size="sm">
            Options For the Question
          </Heading>
        </HStack>
        {options.map((value, index) => (
          <HStack key={index}>
            <Button onClick={removeOption(index)} size="sm">
              Delete
            </Button>
            <Input value={value} required onChange={onArrayChange(index)} />
          </HStack>
        ))}
        <Button onClick={addOption} rightIcon={<AddIcon />} size="sm">
          Add
        </Button>
      </VStack>
    )
  );
};

export const QuestionForm = ({
  edit,
  onChange,
  onCancel,
  onSubmit,
  formValues,
  setFormValues,
}) => {
  return (
    <VStack
      as="form"
      onSubmit={onSubmit}
      gap="20px"
      alignItems="start"
      borderWidth="2px"
      borderRadius="10px"
      padding="1rem"
      width={["300px", "400px", "600px", "900px"]}
    >
      <Input
        fontSize="1.875rem"
        fontWeight="bolder"
        value={formValues.text}
        name="text"
        type="text"
        required
        aria-label="Question Text:"
        onChange={onChange}
      />
      <HStack justifyContent="space-between" width="100%">
        <label
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "1.25rem",
            fontWeight: "bold",
          }}
        >
          Type:
          <Select
            value={formValues.answerType}
            onChange={onChange}
            name="answerType"
            fontWeight="bold"
            fontSize="1.25rem"
          >
            <option value="TEXT">Text</option>
            <option value="BOOLEAN">Boolean</option>
            <option value="NUMBER">Number</option>
            <option value="SELECT">Single Choice</option>
            <option value="MULTISELECT">Multiple Choice</option>
          </Select>
        </label>
        <label>
          Required:
          <div>
            <Switch
              size="lg"
              isChecked={formValues.required}
              name="required"
              type="checkbox"
              onChange={onChange}
            />
          </div>
        </label>
      </HStack>
      <OptionsInput
        options={formValues.options}
        setFormValues={setFormValues}
        answerType={formValues.answerType}
      />

      <HStack justifyContent="space-between" width="100%">
        <Button type="submit" size="sm">
          {edit ? "Update" : "Create"}
        </Button>
        <Button onClick={onCancel} type="button" size="sm">
          Cancel
        </Button>
      </HStack>
    </VStack>
  );
};

const CreateQuestion = ({ closeForm, cancel }) => {
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
    <QuestionForm
      onSubmit={createSurveyInForm}
      onCancel={cancel}
      onChange={onCreateFormChange}
      formValues={createFormValues}
      setFormValues={setFormValues}
    />
  );
};

export default CreateQuestion;
