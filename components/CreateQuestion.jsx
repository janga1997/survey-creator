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
import Head from "next/head";
import { AddIcon } from "@chakra-ui/icons";

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
      <VStack as="fieldset" border="2px" borderRadius="10px" padding="1rem">
        <HStack justifyContent="space-between" width="100%">
          <Heading as="legend" size="sm">
            Options For the Question
          </Heading>
          <Button onClick={addOption} rightIcon={<AddIcon />} size="sm">
            Add
          </Button>
        </HStack>
        {options.map((value, index) => (
          <HStack key={index}>
            <Input value={value} required onChange={onArrayChange(index)} />
            <Button onClick={removeOption(index)} size="sm">
              Delete
            </Button>
          </HStack>
        ))}
      </VStack>
    )
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
    <VStack
      as="form"
      onSubmit={createSurveyInForm}
      gap="20px"
      alignItems="start"
      borderWidth="2px"
      borderRadius="10px"
      padding="1rem"
    >
      <Heading as="legend" size="md">
        Required Inputs
      </Heading>
      <label>
        Question Text:
        <Input
          value={createFormValues.text}
          name="text"
          type="text"
          required
          onChange={onCreateFormChange}
        />
      </label>
      <HStack justifyContent="space-between" width="100%">
        <label>
          Answer Type:
          <Select
            value={createFormValues.answerType}
            onChange={onCreateFormChange}
            name="answerType"
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
              checked={createFormValues.required}
              name="required"
              type="checkbox"
              onChange={onCreateFormChange}
            />
          </div>
        </label>
      </HStack>
      <OptionsInput
        options={createFormValues.options}
        setFormValues={setFormValues}
        answerType={createFormValues.answerType}
      />

      <HStack justifyContent="space-between" width="100%">
        <Button type="submit" size="sm">
          Create
        </Button>
        <Button onClick={cancel} type="button" size="sm">
          Cancel
        </Button>
      </HStack>
    </VStack>
  );
};

export default CreateQuestion;
