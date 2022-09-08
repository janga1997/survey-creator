import express from "express";
import jsonGraphqlExpress from "json-graphql-server";

const app = express();
const data = {
  surveys: [
    { id: 1, title: "Coffee Farm Survey", order: ["1", "2", "3"] },
    { id: 2, title: "Cocoa Farm Survey" },
  ],
  questions: [
    {
      id: 1,
      text: "What's your name?",
      survey_id: 1,
      required: true,
      answerType: "TEXT",
      options: [],
    },
    {
      id: 2,
      text: "What's your age?",
      survey_id: 1,
      required: true,
      answerType: "NUMBER",
      options: [],
    },
    {
      id: 3,
      text: "What's your college?",
      survey_id: 1,
      required: false,
      answerType: "SELECT",
      options: ["IIT Kharagpur"],
    },
  ],
};

app.use("/api/graphql", jsonGraphqlExpress(data));

export default app;
