import { useQuery } from "@apollo/client";

import SurveyView from "../components/SurveyView";

import { GET_SURVEYS } from "../queries";
import { useToggle } from "hooks";
import CreateSurvey from "../components/CreateSurvey";
import { Button, Heading, HStack, VStack } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import Head from "next/head";

const Home = () => {
  const { data } = useQuery(GET_SURVEYS, { fetchPolicy: "cache-and-network" });
  const surveys = data?.Survey || [];

  const [showCreate, toggleCreateForm] = useToggle();

  return (
    <VStack
      gap="50px"
      padding={["2rem", "3rem"]}
      alignItems="center"
      alignContent="center"
    >
      <Head>
        <title>Create Surveys!</title>
      </Head>
      <HStack
        justifyContent="space-between"
        width="100%"
        gap="20px"
        flexWrap="wrap"
      >
        <Heading>List of Surveys</Heading>
        <Button onClick={toggleCreateForm} rightIcon={<AddIcon />}>
          Create Form
        </Button>
      </HStack>

      <HStack
        justifyItems="start"
        width="100%"
        gap="30px"
        flexWrap="wrap"
        alignItems="start"
      >
        {showCreate && <CreateSurvey closeForm={toggleCreateForm} />}
        {surveys.map((survey, index) => (
          <SurveyView {...survey} index={index} key={survey.id} />
        ))}
      </HStack>
    </VStack>
  );
};

export default Home;
