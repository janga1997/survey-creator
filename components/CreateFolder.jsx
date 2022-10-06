import { useMutation } from "@apollo/client";
import { Input } from "@chakra-ui/input";
import { HStack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { React } from "react";

import { useFormChange, useUpdateParentOrder } from "hooks";
import { useRouter } from "next/router";
import { CREATE_FOLDER } from "../mutations";
import { GET_SURVEY_DATA } from "queries";

const CreateFolder = ({ folderId, cancel }) => {
  const {
    query: { surveyId },
  } = useRouter();

  const { addToOrder } = useUpdateParentOrder(folderId);

  const onCreateComplete = (data) => {
    const id = data?.insert_Folder_one?.id;
    addToOrder(id);

    cancel();
  };
  const [createFolder, { loading }] = useMutation(CREATE_FOLDER, {
    onCompleted: onCreateComplete,
    update: (cache, { data: { insert_Folder_one } }) =>
      cache.updateQuery(
        { query: GET_SURVEY_DATA, variables: { surveyId } },
        (data) => ({
          Survey_by_pk: {
            ...data?.Survey_by_pk,
            Folders: [
              ...(data?.Survey_by_pk?.Folders || []),
              insert_Folder_one,
            ],
          },
        })
      ),
  });

  const [createFormValues, onCreateFormChange] = useFormChange({
    name: "",
  });

  const createFolderInForm = (e) => {
    e.preventDefault();
    createFolder({
      variables: {
        ...createFormValues,
        surveyId,
        folderId: folderId,
        order: [],
      },
    });
    return false;
  };

  return (
    <HStack
      as="form"
      maxWidth="100%"
      width={["300px", "400px", "600px", "1000px"]}
      alignSelf="start"
      padding="1rem"
      borderWidth="2px"
      borderRadius="10px"
      backgroundColor="white"
      onSubmit={createFolderInForm}
    >
      <Input
        fontWeight="light"
        fontSize="xl"
        paddingLeft="0"
        name="name"
        value={createFormValues.name}
        onChange={onCreateFormChange}
      ></Input>

      <HStack>
        <Button isLoading={loading} loadingText="Creating" type="submit">
          Create
        </Button>
        <Button onClick={cancel}>Cancel</Button>
      </HStack>
    </HStack>
  );
};

export default CreateFolder;
