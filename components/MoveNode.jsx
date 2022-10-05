import { React, useRef, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Button,
  Select,
  IconButton,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";

import { useGetSurveyData, useMoveNode } from "hooks";

const MoveNode = ({ type, id, folder_id }) => {
  const initialFocusRef = useRef();

  const { folders } = useGetSurveyData();
  const [newFolderId, setNewFolderId] = useState(undefined);

  const [moveFolder, { loading }] = useMoveNode(
    type,
    id,
    folder_id,
    newFolderId === "root" ? null : newFolderId
  );

  return (
    <Popover>
      <PopoverTrigger>
        <Button>Move</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody display="flex" gap="1rem">
          <Select
            placeholder="Select option"
            ref={initialFocusRef}
            value={newFolderId}
            onChange={(e) => {
              setNewFolderId(e.target.value);
            }}
          >
            {Boolean(folder_id) && <option value="root">Survey Root</option>}
            {folders
              .filter(({ id: newId }) => newId !== folder_id && newId !== id)
              .map(({ id: newId, name }) => (
                <option value={newId}>{name}</option>
              ))}
          </Select>
          <IconButton
            colorScheme="blue"
            variant="outline"
            icon={<CheckIcon />}
            onClick={moveFolder}
            isLoading={loading}
            disabled={!Boolean(newFolderId)}
          >
            Submit
          </IconButton>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default MoveNode;
