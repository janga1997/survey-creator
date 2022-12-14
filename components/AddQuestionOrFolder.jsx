import { React } from "react";
import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

const AddQuestionOrFolder = ({
  expandFolder,
  onQuestionClick,
  onFolderClick,
}) => {
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<AddIcon />} onClick={expandFolder}>
        Add
      </MenuButton>
      <MenuList>
        <MenuItem onClick={onQuestionClick}>Question</MenuItem>
        <MenuItem onClick={onFolderClick}>Folder</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default AddQuestionOrFolder;
